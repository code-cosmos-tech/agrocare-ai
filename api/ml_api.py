"""
AgroCare-AI: Machine Learning API's
=====================================
Flask server for handling ML tasks including crop yield prediction,
crop recommendation, and pest identification.

Author: Jay Dholu
Email: jaydholu074@gmail.com
GitHub: https://github.com/jaydholu
"""

__version__ = '1.1.1'
__api_version__ = 'v1'

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
from dotenv import load_dotenv


# ----- LOAD ENVIRONMENT VARIABLES -----
load_dotenv(".env")


# ----- INITIALIZE COLORAMA -----
init(autoreset=True)


# ----- GLOBAL CONSTANTS / GLOBAL VARIABLES -----
VALID_CROPS = [
    'Acrenut', 'Arhar', 'Bajra', 'Banana', 'Barley', 'Black pepper', 'Cardamom', 'Cashewnut', 'Castor seed', 'Coconut', 'Coriander', 'Cotton', 'Dry chillies', 'Garlic', 'Ginger', 'Gram', 'Green gram', 'Groundnut', 'Guar seed', 'Jowar', 'Jute', 'Khesari', 'Kulthi', 'Kusum', 'Linseed', 'Lobia', 'Maize', 'Masoor', 'Mesta', 'Moong', 'Moth', 'Mustard', 'Niger seed', 'Onion', 'Potato', 'Pulses', 'Ragi', 'Rice', 'Sagu', 'Sannhamp', 'Sesamum', 'Small millets', 'Soyabean', 'Sugarcane', 'Sunflower', 'Supari', 'Sweet potato', 'Tobacco', 'Tur', 'Turmeric', 'Urad', 'Wheat'
]
VALID_SEASONS = ['Kharif', 'Rabi', 'Whole Year', 'Summer', 'Winter', 'Autumn']


# ----- CONFIGURATIONS -----
class Config:
    """Application configuration class"""
    DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'
    PORT = int(os.environ.get('PORT') or 5000)
    HOST = os.environ.get('HOST', '127.0.0.1')
    CORS_ORIGINS = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:4000',
        'http://127.0.0.1:4000',
        'https://agro-care-ai.vercel.app'  # Production URL here
    ]
    
    # MAX_IMAGE_SIZE = 50 * 1024 * 1024
    # ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}


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


# ----- LOADING NECESSARY MODELS -----
try:
    crops_model = joblib.load('../models/crops/crops_yield_predictor.joblib')
    coconut_model = joblib.load('../models/crops/coconut_yield_predictor.joblib')
    print(Fore.GREEN + "  Successfully loaded crop_model and coconut_model.")
except FileNotFoundError as e:
    print(Fore.RED + f"  Error loading model: {e}. API will not work.")
    crops_model = None
    coconut_model = None
except Exception as e:
    print(Fore.RED + f"  An unexpected error occurred loading models: {e}")
    crops_model = None
    coconut_model = None


# ----- HELPER FUNCTIONS -----
def validate_required_fields(data: Dict[str, Any], required_fields: list) -> Optional[str]:
    missing_fields = [field for field in required_fields if field not in data or data[field] is None]
    if missing_fields:
        return f"Missing required fields: {', '.join(missing_fields)}"
    return None


def create_success_response(data: Dict[str, Any], status_code: int = 200) -> tuple:
    return jsonify({"success": True, "data": data}), status_code


def create_error_response(message: str, status_code: int) -> tuple:
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
        'Annual_Rainfall': float(data.get('Annual_Rainfall', 0)),
        'Fertilizer_Per_Hectare': float(data.get('Fertilizer_Per_Hectare', 0)),
        'Pesticide_Per_Hectare': float(data.get('Pesticide_Per_Hectare', 0))
    }])
    
    # Checking if crop is coconut
    if str(data.get('Crop', '')).strip().lower() == 'coconut':
        input_df.drop(columns=['Crop'], inplace=True)    # Remove Crop parameter for prediction of coconut
    
    return input_df


def validate_numeric_fields(data: Dict[str, Any]) -> Optional[str]:
    """
    Validate numeric fields to ensure they are within realistic ranges.
    Returns error message if validation fails, None otherwise.
    """
    validations = {
        'Area': {
            'min': 0.01,  # Minimum 0.01 hectares (100 sq meters)
            'max': 100000,  # Maximum 100,000 hectares
            'unit': 'hectares'
        },
        'Annual_Rainfall': {
            'min': 0,  # Can be 0 in desert regions
            'max': 15000,  # Maximum ~15,000 mm (highest recorded regions)
            'unit': 'mm'
        },
        'Fertilizer_Per_Hectare': {
            'min': 0,  # Can be 0 (organic farming)
            'max': 1000,  # Maximum 1000 kg/hectare (very high usage)
            'unit': 'kg/hectare'
        },
        'Pesticide_Per_Hectare': {
            'min': 0,  # Can be 0 (organic farming)
            'max': 100,  # Maximum 100 kg/hectare (very high usage)
            'unit': 'kg/hectare'
        }
    }
    
    for field, constraints in validations.items():
        if field in data:
            try:
                value = float(data[field])
                
                # Check if value is a valid number (not NaN or Infinity)
                if not np.isfinite(value):
                    return f"{field} must be a valid finite number"
                
                # Check minimum constraint
                if value < constraints['min']:
                    return f"{field} must be at least {constraints['min']} {constraints['unit']}"
                
                # Check maximum constraint
                if value > constraints['max']:
                    return f"{field} cannot exceed {constraints['max']} {constraints['unit']}"
                    
            except (ValueError, TypeError):
                return f"{field} must be a valid number"
    
    return None


def validate_categorical_fields(data: Dict[str, Any]) -> Optional[str]:
    """
    Validate categorical fields like Crop, Season, and State.
    Returns error message if validation fails, None otherwise.
    """
    
    # Fetch all keys in data
    data_keys = data.keys()
    
    # Check Season
    if 'Season' in data_keys:
        season = str(data['Season']).strip()
        if season not in VALID_SEASONS:
            return f"Invalid Season. Must be one of: {', '.join(VALID_SEASONS)}"
    
    # Check Crop
    if 'Crop' in data_keys:
        crop = str(data['Crop']).strip()
        if crop not in VALID_CROPS:
            return f"Invalid Crop. Must be one of: {', '.join(VALID_CROPS)}"
    
    # Check State
    # valid_states = ['Odisha']
    # if 'State' in data_keys:
    #     state = str(data['State']).strip()
    #     if state not in valid_states:
    #         return f"Invalid State. Must be one of: {', '.join(valid_states)}"
    
    return None


# ----- ROUTES / ENDPOINTS -----
@app.route('/')
@app.route('/home')
def home():
    """A simple welcome message to check if the server is running."""
    return "<h1 align='center'>AgroCare-AI API <br> The ML server is running. Use the /api/v1/info endpoint to know more.</h1>"


@app.route(f'/api/{__api_version__}/system/info', methods=['GET'])
def api_info():
    """Root endpoints - API information"""
    return jsonify({
        'name': 'AgroCare-AI ML API',
        'api version': f'{__api_version__}',
        'status': 'running',
        'endpoints': [
            'GET  / or /home                        - Welcome message',
            f'GET  /api/{__api_version__}/system/info               - API information',
            f'GET  /api/{__api_version__}/system/health             - Health check',
            f'POST /api/{__api_version__}/crops/predict/yield       - Crop yield prediction',
            f'POST /api/{__api_version__}/crops/recommend           - Crop recommendation',
            f'POST /api/{__api_version__}/fertilizers/recommend     - Fertilizers recommendation',
            f'POST /api/{__api_version__}/pests/identify            - Pest identification',
        ],
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    })
    

@app.route(f'/api/{__api_version__}/system/health', methods=['GET'])
def health_check():
    """ML API health check endpoint"""
    model_statuses = {
        'loaded_crops_model': crops_model is not None,
        'loaded_coconut_model': coconut_model is not None
    }
    return create_success_response({
        'server': 'Flask',
        'port': Config.PORT,
        'debug': app.config['DEBUG'],
        'model_status': 'loaded' if all(model_statuses.values()) else 'not loaded'
    })


@app.route(f'/api/{__api_version__}/crops/predict/yield', methods=['POST', 'OPTIONS'])
def predict_yield():
    """Receives input data, preprocesses it, and returns yield prediction."""
    if request.method == 'OPTIONS':
        return '', 204
    
    print(Fore.CYAN + "Received request for yield prediction.")

    if not all([crops_model, coconut_model]):
        print(Fore.YELLOW + "Prediction failed: Models not loaded.")
        return create_error_response('Models are not available for predictions. Please contact support.', 503)

    try:
        json_data = request.get_json()
        if not json_data:
            print(Fore.YELLOW + "No input data provided.")
            return create_error_response('No input data provided in request body.', 400)

        # Validating required fields
        required_fields = ['Crop', 'Season', 'State', 'Annual_Rainfall', 'Fertilizer_Per_Hectare', 'Pesticide_Per_Hectare']
        validation_error = validate_required_fields(json_data, required_fields)
        if validation_error:
            print(Fore.YELLOW + f"Validation error: {validation_error}")
            return create_error_response(validation_error, 400)
        
        # Validating numeric fields
        numeric_validation_error = validate_numeric_fields(json_data)
        if numeric_validation_error:
            print(Fore.YELLOW + f"Numeric validation error: {numeric_validation_error}")
            return create_error_response(numeric_validation_error, 400)
        
        # Validating categorical fields
        categorical_validation_error = validate_categorical_fields(json_data)
        if categorical_validation_error:
            print(Fore.YELLOW + f"Categorical validation error: {categorical_validation_error}")
            return create_error_response(categorical_validation_error, 400)
        
        # Fetching Crop, Season and State
        crop = str(json_data.get('Crop'))
        season = str(json_data.get('Season'))
        state = str(json_data.get('State'))

        print(Fore.CYAN + f"Input data: {json_data}")
        input_df = preprocess_input_data(json_data)
        print(Fore.CYAN + f"Preprocessed DataFrame:\n{input_df}")

        # Making prediction
        if crop.lower() != 'coconut':
            prediction = crops_model.predict(input_df)
        else:
            prediction = coconut_model.predict(input_df)
        
        # Extract prediction value (handle both 1D and 2D arrays)
        if isinstance(prediction, np.ndarray):
            if prediction.ndim == 2:
                predicted_yield = float(prediction[0][0])
            else:
                predicted_yield = float(prediction[0])
        else:
            predicted_yield = float(prediction)
        
        result = {
            'yield': round(predicted_yield, 6),
            'unit': 'tons/hectare' if crop.lower() != 'coconut' else 'nuts/hectare',
            'input_summary': {
                'crop': crop,
                'season': season,
                'state': state
            }
        }
        
        print(Fore.GREEN + f"Prediction successful: {result['yield']} {result['unit']}")
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
    
    
@app.route(f'/api/{__api_version__}/crops/recommend', methods=['POST'])
def recommend_crop():
    """Crop recommendation endpoint"""
    # yet to implement
    return create_error_response('This endpoint is not yet implemented.', 501)


@app.route(f'/api/{__api_version__}/fertilizers/recommend', methods=['POST'])
def recommend_fertilizers():
    """Fertilizer recommendation endpoint"""
    # yet to implement
    return create_error_response('This endpoint is not yet implemented.', 501)


@app.route(f'/api/{__api_version__}/pests/identify', methods=['POST'])
def identify_pest():
    """Pest identification endpoint"""
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
    print(f"  Server: http://{Config.HOST}:{Config.PORT}")
    print(f"  Debug Mode: {Config.DEBUG}")
    print(f"  Environment: {'Development' if Config.DEBUG else 'Production'}")
    print(f"  CORS Origins: {Config.CORS_ORIGINS}")
    print(Fore.GREEN + "\n  📡 Available Endpoints:")
    print(f"     GET  / or /home                         - Welcome message")
    print(f"     GET  /api/{__api_version__}/system/info                - API information")
    print(f"     GET  /api/{__api_version__}/system/health              - Health check")
    print(f"     POST /api/{__api_version__}/crops/predict/yield        - Crop yield prediction")
    print(f"     POST /api/{__api_version__}/crops/recommend            - Crop recommendation")
    print(f"     POST /api/{__api_version__}/fertilizers/recommend      - Fertilizers recommendation")
    print(f"     POST /api/{__api_version__}/pests/identify             - Pest identification")
    print(Fore.GREEN + "=" * 60 + "\n")
    
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
    