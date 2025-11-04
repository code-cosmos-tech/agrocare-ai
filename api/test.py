from joblib import load
import pandas as pd


model = load('models/yield_predictor.joblib')

input_values = [ 'Wheat', 'Kharif', 'Punjab', 20, 10, 20, 40]

input_df = pd.DataFrame(
    [input_values],  # Single row of raw data
    columns=[
        'Crop', 'Season', 'State', 'Area', 'Annual_Rainfall',
        'Fertilizer_Per_Hectare', 'Pesticide_Per_Hectare'
    ]
)

prediction = model.predict(input_df)

print("Input values:", input_values)
print("Final prediction:", prediction[0])
