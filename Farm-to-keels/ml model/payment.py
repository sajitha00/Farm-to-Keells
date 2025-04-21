from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Import added
import paypalrestsdk
import time

app = Flask(__name__)
CORS(app)  # ✅ CORS initialized

# Configure PayPal SDK
paypalrestsdk.configure({
    "mode": "sandbox",  # Use "live" for production
    "client_id": "AaeZMGk38rJjEsfWjlcltlSSdmcvgeAG4mEWv5NEs_IvZAXicfc1b0sRsUQHFNsXsnI041JuOhRhW-5r",
    "client_secret": "EONVhyZGo5L9p7FRiKyeGcFmGPbZ7THjec4d8OQLWvgsKYKiKVBElhd8kznER7moS-acu2JdfkXoZS_O"
})

@app.route('/api/send-payment', methods=['POST'])
def send_payment():
    data = request.json
    farmer_email = data.get('email')
    amount = data.get('amount')

    if not farmer_email or not amount:
        return jsonify({"error": "Email and amount are required."}), 400

    payout = paypalrestsdk.Payout({
        "sender_batch_header": {
            "sender_batch_id": "batch_" + str(int(time.time())),
            "email_subject": "You have a payment from Farm to Keels!"
        },
        "items": [{
            "recipient_type": "EMAIL",
            "amount": {
                "value": str(amount),
                "currency": "USD"
            },
            "receiver": farmer_email,
            "note": "Thank you for your produce!",
            "sender_item_id": "item_1"
        }]
    })

    # Try to create the payout
    if payout.create(sync_mode=False):
        return jsonify({"message": "Payment sent successfully!"}), 200
    else:
        print("❌ PayPal Payout Error:")
        print(payout.error)  # Log full error in terminal
        return jsonify({
            "error": "Payment failed.",
            "details": payout.error  # Return error details to frontend
        }), 400

if __name__ == '__main__':
    app.run(port=5001, debug=True)
