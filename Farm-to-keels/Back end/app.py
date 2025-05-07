from flask import Flask, jsonify
from flask_cors import CORS  # ✅ Add this line
import pandas as pd
from sklearn.linear_model import LinearRegression

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS

# Load dataset
df = pd.read_csv('farm_to_keels_demand_2022_2024.csv')

# Encode categorical variables
df['location_code'] = pd.Categorical(df['location']).codes
df['product_code'] = pd.Categorical(df['product']).codes

# Define X (input features) and y (target)
X = df[['location_code', 'product_code', 'month', 'year']]
y = df['demand_kg']

# Train model
model = LinearRegression()
model.fit(X, y)

# Get unique values
locations = df['location'].unique()
products = df['product'].unique()
years = [2025]  # We only want predictions for 2025
months = list(range(1, 13))  # 1 to 12

# Month number to name
month_map = {
    1: 'January', 2: 'February', 3: 'March', 4: 'April',
    5: 'May', 6: 'June', 7: 'July', 8: 'August',
    9: 'September', 10: 'October', 11: 'November', 12: 'December'
}

@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    predictions = []

    for location in locations:
        for product in products:
            for month in months:
                loc_code = pd.Categorical([location], categories=locations).codes[0]
                prod_code = pd.Categorical([product], categories=products).codes[0]
                year = 2025
                pred_quantity = model.predict([[loc_code, prod_code, month, year]])[0]

                predictions.append({
                    'location': location,
                    'product': product,
                    'month': month_map[month],
                    'year': year,
                    'predicted_quantity': round(pred_quantity, 2)
                })

    return jsonify(predictions)

if __name__ == '__main__':
    app.run(debug=True)
