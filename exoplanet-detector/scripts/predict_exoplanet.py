import sys
import json
import pickle
import numpy as np
import os

def load_model(model_path='model.pkl'):
    """Load the pickled ML model"""
    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        return model
    except FileNotFoundError:
        print(json.dumps({
            'error': 'Model file not found. Please place your model.pkl file in the scripts directory.'
        }))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({
            'error': f'Failed to load model: {str(e)}'
        }))
        sys.exit(1)

def prepare_features(data, feature_names):
    """
    Prepare features in the correct order expected by the model
    Expected features: ['koi_model_snr', 'koi_prad', 'koi_insol', 'koi_slogg', 
                        'koi_period', 'koi_duration', 'koi_depth', 'koi_impact', 
                        'koi_steff', 'koi_period_err1', 'koi_period_err2', 
                        'koi_depth_err1', 'koi_depth_err2', 'koi_duration_err1', 
                        'koi_duration_err2', 'koi_prad_err1', 'koi_prad_err2', 'koi_srad']
    """
    features = []
    for feature in feature_names:
        value = data.get(feature, 0.0)  # Default to 0 if missing
        features.append(float(value))
    return np.array(features).reshape(1, -1)

def predict(model, features):
    """Make prediction using the loaded model"""
    try:
        # Get prediction
        prediction = model.predict(features)[0]
        
        # Get probability if available
        if hasattr(model, 'predict_proba'):
            probabilities = model.predict_proba(features)[0]
            confidence = float(max(probabilities))
            prob_exoplanet = float(probabilities[1]) if len(probabilities) > 1 else float(prediction)
            prob_false_positive = float(probabilities[0]) if len(probabilities) > 1 else float(1 - prediction)
        else:
            # If model doesn't support probabilities, use binary prediction
            confidence = 0.95 if prediction == 1 else 0.85
            prob_exoplanet = float(prediction)
            prob_false_positive = float(1 - prediction)
        
        return {
            'prediction': int(prediction),
            'confidence': confidence,
            'probability_exoplanet': prob_exoplanet,
            'probability_false_positive': prob_false_positive
        }
    except Exception as e:
        return {
            'error': f'Prediction failed: {str(e)}'
        }

def main():
    # Expected feature names in order
    FEATURE_NAMES = [
        'koi_model_snr', 'koi_prad', 'koi_insol', 'koi_slogg', 
        'koi_period', 'koi_duration', 'koi_depth', 'koi_impact', 
        'koi_steff', 'koi_period_err1', 'koi_period_err2', 
        'koi_depth_err1', 'koi_depth_err2', 'koi_duration_err1', 
        'koi_duration_err2', 'koi_prad_err1', 'koi_prad_err2', 'koi_srad'
    ]
    
    # Read input from command line argument
    if len(sys.argv) < 2:
        print(json.dumps({
            'error': 'No input data provided'
        }))
        sys.exit(1)
    
    try:
        input_data = json.loads(sys.argv[1])
    except json.JSONDecodeError:
        print(json.dumps({
            'error': 'Invalid JSON input'
        }))
        sys.exit(1)
    
    # Load model
    model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
    model = load_model(model_path)
    
    # Prepare features
    features = prepare_features(input_data, FEATURE_NAMES)
    
    # Make prediction
    result = predict(model, features)
    
    # Output result as JSON
    print(json.dumps(result))

if __name__ == '__main__':
    main()
