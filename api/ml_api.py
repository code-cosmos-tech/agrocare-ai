"""
AgroCare-AI: Machine Learning API's
=====================================
Flask server for handling ML tasks including crop yield prediction,
crop recommendation, and pest identification.

Author: Jay Dholu
Email: jaydholu074@gmail.com
GitHub: https://github.com/jaydholu
Feel free to reach me out ;) at anytime
"""

__version__ = '1.0.0'


import os
import traceback
from typing import Dict, Any, Optional
from datetime import datetime
from colorama import init, Fore

import joblib
import pandas as pd
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
        'http://localhost:3000',      # React frontend
        'https://127.0.0.1:3000',
        'http://localhost:4000',      # Node.js backend
        'https://127.0.0.1:4000'
    ]

    MAX_IMAGE_SIZE = 50 * 1024 * 1024           # 50MB
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
    model = joblib.load('model_utils/yield_predictor.joblib')
    print(Fore.GREEN + f"Model loaded successfully!\n")
except FileNotFoundError as e:
    print(Fore.RED + f"CRITICAL: Model file not found. API cannot make predictions. Details: {e}\n")
    model = None
except Exception as e:
    print(Fore.RED + f"CRITICAL: An error occurred during model loading: {e}\n")
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


# ----- ML RECOMMENDATION FUNCTIONS -----
def identify_pest_ml(image_data: str, plant_type: str = 'general') -> Dict[str, Any]:
    # Yet to implement
    pass

def recommend_crop_ml(soil_data: Dict[str, Any], location_data: Dict[str, Any]) -> Dict[str, Any]:
    # Yet to implement
    pass


# ----- ROUTES / ENDPOINTS -----
@app.route('/')
def home():
    """A simple welcome message to check if the server is running."""
    return "<h1 align='center'>Agro Care API <br> The ML server is running. Use the /api/v1/info endpoint to know more.</h1>"


@app.route('/api/v1/info')
def api_info():
    """Root endpoints - API information"""
    return jsonify({
        'name': 'Farm Management ML API',
        'version': f'{__version__}',
        'status': 'running',
        'endpoints': [
            'GET  /                - Welcome message or home',
            'GET  /api/v1/info     - API information',
            'GET  /api/v1/health   - ML API health check',
            'POST /api/v1/crops/predict   - Crop yield prediction',
            'POST /api/v1/crops/recommend - Crop recommendation',
            'POST /api/v1/pests/identify  - Pest identification'
        ],
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    })
    

@app.route('/api/v1/health', methods=['GET'])
def health_check():
    """ML API health check endpoint"""
    return create_success_response(
        'Agro Care ML API is healthy and running',
        {
            'server': 'Flask',
            'port': Config.PORT,
            'debug': app.config['DEBUG']
        }
    )


@app.route('/api/v1/crops/predict', methods=['POST'])
def predict_yield():
    """
    Receives input data, preprocesses it using loaded components,
    makes a prediction with the model, and returns the result.
    """
    print(Fore.CYAN + "Received request for yield prediction.")

    if not model:
        print(Fore.YELLOW + "Prediction failed: Model components are not loaded.")
        return create_error_response('Model is not available. Please contact support.', 503)

    try:
        json_data = request.get_json()
        if not json_data:
            print(Fore.YELLOW + "Prediction failed: No input data provided.")
            return create_error_response('No input data provided in request body.', 400)

        input_df = pd.DataFrame(
            [json_data],
            columns=[
                'Crop', 'Season', 'State', 'Area', 'Annual_Rainfall',
                'Fertilizer_Per_Hectare', 'Pesticide_Per_Hectare'
            ]
        )
        print(Fore.CYAN + f"Input data for prediction: {json_data}")
        prediction = model.predict(input_df)
        
        result = {'predicted_yield_ton_per_hectare': round(prediction[0][0], 4)}
        print(Fore.GREEN + f"Prediction successful. Result: {result}")

        return create_success_response(result)

    except KeyError as e:
        print(Fore.RED + f"Prediction failed due to missing key: {e}. Traceback: {traceback.format_exc()}")
        return create_error_response(f"Missing required feature in input data: {e}", 400)
    except Exception as e:
        print(Fore.RED + f"An unexpected error occurred during prediction: {traceback.format_exc()}")
        return create_error_response(f'An internal server error occurred.', 500)
    
    
@app.route('/api/v1/crops/recommend', methods=['POST'])
def recommend_crop():
    pass


@app.route('/api/v1/pests/identify', methods=['POST'])
def identify_pest():
    pass


@app.errorhandler(404)
def not_found(error):
    print(Fore.YELLOW + f"Caught not found error: {error}")
    return create_error_response('The requested URL was not found on the server.', 404)


@app.errorhandler(405)
def method_not_allowed(error):
    print(Fore.YELLOW + f"Caught method not allowed error: {error}")
    return create_error_response('The method is not allowed for the requested URL.', 405)


@app.errorhandler(500)
def internal_error(error):
    print(Fore.RED + f"Caught internal server error: {error}")
    return create_error_response('An unexpected internal server error occurred.', 500)


if __name__ == '__main__':
    print(Fore.GREEN + "==> Farm Management ML API Starting...")
    print(f"  - Server: http://{Config.HOST}:{Config.PORT}")
    print(f"  - Debug Mode: {Config.DEBUG}")
    print(f"  - Environment: {'Development' if Config.DEBUG else 'Production'}")
    print(f"  - Allowed Origins: {Config.CORS_ORIGINS}")
    print(Fore.GREEN + "==> Available ML Endpoints:")
    print("   GET  /                     - Welcome message or home")
    print("   GET  /api/v1/info          - API information")
    print("   GET  /api/v1/health        - ML API health check")
    print("   POST /api/v1/crops/predict - Crop yield prediction")
    print("   POST /api/v1/crops/recommend - Crop recommendation")
    print("   POST /api/v1/pests/identify  - Pest identification")
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
