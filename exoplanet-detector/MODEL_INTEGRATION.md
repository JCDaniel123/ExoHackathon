# ML Model Integration Guide

This guide explains how to integrate your Python pickle ML model with the exoplanet detection website.

## Quick Start

1. **Place your model file** in the `scripts/` directory and name it `model.pkl`
2. **Ensure Python dependencies** are installed:
   \`\`\`bash
   pip install numpy scikit-learn
   \`\`\`
3. **Test the integration** by uploading data or using the manual classifier

## Model Requirements

Your pickle file should contain a trained scikit-learn model (or compatible) that:

- Accepts 18 features in this exact order:
  1. `koi_model_snr` - Signal-to-Noise Ratio
  2. `koi_prad` - Planetary Radius (Earth radii)
  3. `koi_insol` - Insolation Flux (Earth flux)
  4. `koi_slogg` - Surface Gravity (log10(cm/s²))
  5. `koi_period` - Orbital Period (days)
  6. `koi_duration` - Transit Duration (hours)
  7. `koi_depth` - Transit Depth (ppm)
  8. `koi_impact` - Impact Parameter
  9. `koi_steff` - Stellar Effective Temperature (K)
  10. `koi_period_err1` - Period Upper Error
  11. `koi_period_err2` - Period Lower Error
  12. `koi_depth_err1` - Depth Upper Error
  13. `koi_depth_err2` - Depth Lower Error
  14. `koi_duration_err1` - Duration Upper Error
  15. `koi_duration_err2` - Duration Lower Error
  16. `koi_prad_err1` - Radius Upper Error
  17. `koi_prad_err2` - Radius Lower Error
  18. `koi_srad` - Stellar Radius (Solar radii)

- Returns binary classification: 0 (False Positive) or 1 (Confirmed Exoplanet)
- Optionally supports `predict_proba()` for confidence scores

## How It Works

### Architecture

\`\`\`
User Input (CSV/Form) 
  → Next.js API Route (/api/classify)
  → Python Script (scripts/predict_exoplanet.py)
  → Load Model (model.pkl)
  → Make Prediction
  → Return JSON Result
  → Display in UI
\`\`\`

### Data Flow

1. **User submits data** via CSV upload or manual form entry
2. **API route** receives data and maps field names to model features
3. **Python script** is executed with the data as JSON input
4. **Model loads** from pickle file and makes prediction
5. **Results return** as JSON with classification and confidence
6. **UI displays** the results with visualization

### Fallback Behavior

If the model file is not found or fails to load, the system automatically falls back to a simple rule-based classifier. This ensures the website remains functional while you set up your model.

## CSV Upload Format

Your CSV files should include columns matching the feature names above. The system will automatically map common column name variations:

- `snr` → `koi_model_snr`
- `planet_radius` → `koi_prad`
- `orbital_period` → `koi_period`
- etc.

Example CSV structure:
\`\`\`csv
koi_period,koi_duration,koi_depth,koi_model_snr,koi_prad,koi_insol
3.52,2.8,0.012,25.4,1.8,450.2
\`\`\`

## Testing Your Model

1. **Manual Entry**: Use the Classifier page to enter individual exoplanet parameters
2. **CSV Upload**: Upload a CSV file with multiple candidates
3. **Check Results**: Verify classifications match your expectations
4. **View Statistics**: Check the Statistics page for model performance metrics

## Troubleshooting

### Model Not Loading
- Ensure `model.pkl` is in the `scripts/` directory
- Check Python version compatibility (Python 3.7+)
- Verify pickle was created with compatible scikit-learn version

### Incorrect Predictions
- Verify feature order matches exactly
- Check that input data is properly scaled (if your model expects scaled data)
- Ensure missing values are handled appropriately

### Performance Issues
- For large CSV files, consider batch processing
- Optimize model size if loading is slow
- Cache model in memory for repeated predictions

## Advanced: Custom Model Integration

If your model uses different features or a different framework, modify `scripts/predict_exoplanet.py`:

1. Update `FEATURE_NAMES` list with your features
2. Modify `prepare_features()` to match your preprocessing
3. Update `predict()` to work with your model's API
4. Adjust the API route mapping in `app/api/classify/route.ts`

## Example: Training a Compatible Model

\`\`\`python
from sklearn.ensemble import RandomForestClassifier
import pickle

# Train your model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Save as pickle
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)
\`\`\`

## Support

If you encounter issues integrating your model, check:
1. Python script output: `python3 scripts/predict_exoplanet.py '{"koi_period": 3.5, ...}'`
2. Browser console for API errors
3. Server logs for Python execution errors
