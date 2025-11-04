"""
AgroCare-AI: Machine Learning API's
=====================================
Flask server for handling ML tasks including crop yield prediction,
crop recommendation, and pest identification.

Author: Jay Dholu
Email: jaydholu074@gmail.com
GitHub: https://github.com/jaydholu
"""

__version__ = '1.0.1'

import os
import traceback
from typing import Dict, Any, Optional
from datetime import datetime
from colorama import init, Fore

import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS


# ----- INITIALIZE COLORAMA -----
init(autoreset=True)


# ----- CONFIGURATIONS -----
class Config:
    """Application configuration class"""
    DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'
    PORT = int(os.environ.get('PORT', 5000))
    HOST = os.environ.get('HOST', '127.0.0.1')
    CORS_ORIGINS = [
        'http://localhost:3000',
        'https://127.0.0.1:3000',
        'http://localhost:4000',
        'https://127.0.0.1:4000',
        'https://agro-care-ai.vercel.app'  # Add production URL here
    ]
    MAX_IMAGE_SIZE = 50 * 1024 * 1024
    ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}


# ----- FLASK APP -----
app = Flask(__name__)
app.config.from_object(Config)
CORS(
    app, 
    origins=Config.CORS_ORIGINS,
    methods=['GET', 'POST', 'OPTIONS'],
    allow_headers=['Content-Type', 'Authorization'],
    supports_credentials=True
)


# ----- LOADING NECESSARY COMPONENTS -----
try:
    model = joblib.load('models/yield_predictor.joblib')
    print(Fore.GREEN + f"Model loaded successfully!\n")
except FileNotFoundError as e:
    print(Fore.RED + f"CRITICAL: Model file not found. Details: {e}\n")
    model = None
except Exception as e:
    print(Fore.RED + f"CRITICAL: Error loading model: {e}\n")
    model = None


# ----- HELPER FUNCTIONS -----
def validate_required_fields(data: Dict[str, Any], required_fields: list) -> Optional[str]:
    missing_fields = [field for field in required_fields if field not in data or data[field] is None]
    if missing_fields:
        return f"Missing required fields: {', '.join(missing_fields)}"
    return None


def create_success_response(data: Dict[str, Any], status_code: int = 200):
    return jsonify({"success": True, "data": data}), status_code


def create_error_response(message: str, status_code: int):
    return jsonify({"success": False, "error": {"message": message}}), status_code


def preprocess_input_data(data: Dict[str, Any]) -> pd.DataFrame:
    """
    Preprocess input data to match the format expected by the model.
    This ensures consistent predictions.
    """
    # Creating DataFrame with exact column order
    input_df = pd.DataFrame([{
        'Crop': str(data.get('Crop', '')).strip(),
        'Season': str(data.get('Season', '')).strip(),
        'State': str(data.get('State', 'Odisha')).strip(),
        'Area': float(data.get('Area', 0)),
        'Annual_Rainfall': float(data.get('Annual_Rainfall', 0)),
        'Fertilizer_Per_Hectare': float(data.get('Fertilizer_Per_Hectare', 0)),
        'Pesticide_Per_Hectare': float(data.get('Pesticide_Per_Hectare', 0))
    }])
    
    return input_df


# ----- ROUTES / ENDPOINTS -----
@app.route('/')
@app.route("/home")
def home():
    """A simple welcome message to check if the server is running."""
    return "<h1 align='center'>AgroCare-AI API <br> The ML server is running. Use the /api/v1/info endpoint to know more.</h1>"


@app.route('/api/v1/info')
def api_info():
    """Root endpoints - API information"""
    return jsonify({
        'name': 'AgroCare-AI ML API',
        'version': f'{__version__}',
        'status': 'running',
        'endpoints': [
            'GET  / or /home                        - Welcome message',
            'GET  /api/v1/info                      - API information',
            'GET  /api/v1/health                    - Health check',
            'POST /api/v1/crops/predict/yield       - Crop yield prediction',
            'POST /api/v1/crops/recommend           - Crop recommendation',
            'POST /api/v1/pests/identify            - Pest identification'
        ],
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    })
    

@app.route('/api/v1/health', methods=['GET'])
def health_check():
    """ML API health check endpoint"""
    model_status = 'loaded' if model is not None else 'not loaded'
    return create_success_response({
        'server': 'Flask',
        'port': Config.PORT,
        'debug': app.config['DEBUG'],
        'model_status': model_status
    })


@app.route('/api/v1/crops/predict/yield', methods=['POST', 'OPTIONS'])
def predict_yield():
    """
    Receives input data, preprocesses it, and returns yield prediction.
    FIXED: Now ensures consistent preprocessing for stable predictions.
    """
    if request.method == 'OPTIONS':
        return '', 204
    
    print(Fore.CYAN + "Received request for yield prediction.")

    if not model:
        print(Fore.YELLOW + "Prediction failed: Model not loaded.")
        return create_error_response('Model is not available. Please contact support.', 503)

    try:
        json_data = request.get_json()
        if not json_data:
            print(Fore.YELLOW + "No input data provided.")
            return create_error_response('No input data provided in request body.', 400)

        # Validating required fields
        required_fields = ['Crop', 'Season', 'Area', 'Annual_Rainfall', 
                          'Fertilizer_Per_Hectare', 'Pesticide_Per_Hectare']
        validation_error = validate_required_fields(json_data, required_fields)
        if validation_error:
            print(Fore.YELLOW + f"Validation error: {validation_error}")
            return create_error_response(validation_error, 400)

        print(Fore.CYAN + f"Input data: {json_data}")
        
        input_df = preprocess_input_data(json_data)
        
        print(Fore.CYAN + f"Preprocessed DataFrame:\n{input_df}")
        print(Fore.CYAN + f"DataFrame dtypes:\n{input_df.dtypes}")

        # Making prediction 
        prediction = model.predict(input_df)
        
        # Extract prediction value (handle both 1D and 2D arrays)
        if isinstance(prediction, np.ndarray):
            if prediction.ndim == 2:
                predicted_yield = float(prediction[0][0])
            else:
                predicted_yield = float(prediction[0])
        else:
            predicted_yield = float(prediction)
        
        result = {
            'yield': round(predicted_yield, 4),
            'unit': 'tons/hectare',
            'input_summary': {
                'crop': json_data.get('Crop'),
                'season': json_data.get('Season'),
                'area': json_data.get('Area')
            }
        }
        
        print(Fore.GREEN + f"Prediction successful: {result['yield']} tons/hectare")
        return create_success_response(result)

    except KeyError as e:
        error_msg = f"Missing required feature: {str(e)}"
        print(Fore.RED + f"{error_msg}")
        return create_error_response(error_msg, 400)
    
    except ValueError as e:
        error_msg = f"Invalid data format: {str(e)}"
        print(Fore.RED + f"{error_msg}")
        return create_error_response(error_msg, 400)
    
    except Exception as e:
        print(Fore.RED + f"Unexpected error: {traceback.format_exc()}")
        return create_error_response('An internal server error occurred.', 500)
    
    
@app.route('/api/v1/crops/recommend', methods=['POST'])
def recommend_crop():
    """Crop recommendation endpoint - to be implemented"""
    # yet to implement
    return create_error_response('This endpoint is not yet implemented.', 501)


@app.route('/api/v1/pests/identify', methods=['POST'])
def identify_pest():
    """Pest identification endpoint - to be implemented"""
    # yet to implement
    return create_error_response('This endpoint is not yet implemented.', 501)


@app.errorhandler(404)
def not_found(error):
    print(Fore.YELLOW + f"404 error: {error}")
    return create_error_response('The requested URL was not found on the server.', 404)


@app.errorhandler(405)
def method_not_allowed(error):
    print(Fore.YELLOW + f"405 error: {error}")
    return create_error_response('The method is not allowed for the requested URL.', 405)


@app.errorhandler(500)
def internal_error(error):
    print(Fore.RED + f"500 error: {error}")
    return create_error_response('An unexpected internal server error occurred.', 500)


if __name__ == '__main__':
    print(Fore.GREEN + "=" * 60)
    print(Fore.GREEN + "  AgroCare-AI ML API Starting...")
    print(Fore.GREEN + "=" * 60)
    print(f"  🌐 Server: http://{Config.HOST}:{Config.PORT}")
    print(f"  🔧 Debug Mode: {Config.DEBUG}")
    print(f"  🌍 Environment: {'Development' if Config.DEBUG else 'Production'}")
    print(f"  🔒 CORS Origins: {Config.CORS_ORIGINS}")
    print(Fore.GREEN + "\n  📡 Available Endpoints:")
    print("     GET  / or /home                     - Welcome message")
    print("     GET  /api/v1/info                   - API information")
    print("     GET  /api/v1/health                 - Health check")
    print("     POST /api/v1/crops/predict/yield    - Crop yield prediction")
    print("     POST /api/v1/crops/recommend        - Crop recommendation")
    print("     POST /api/v1/pests/identify         - Pest identification")
    print(Fore.GREEN + "=" * 60 + "\n")
    
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
    