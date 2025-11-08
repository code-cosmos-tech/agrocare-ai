from joblib import load
import pandas as pd


model = load('models/yield_predictor.joblib')

input_values = [ 'Coconut', 'Kharif', 'Assam', 10, 20, 40]

input_df = pd.DataFrame(
    [input_values],
    columns=[
        'Crop', 'Season', 'State', 'Annual_Rainfall',
        'Fertilizer_Per_Hectare', 'Pesticide_Per_Hectare'
    ]
)

prediction = model.predict(input_df)

print("Input values:", input_values)
print("Final prediction:", prediction[0])
