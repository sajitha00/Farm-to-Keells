from flask import Flask, request, jsonify
from flask_cors import CORS
import paypalrestsdk
import time
from supabase import create_client, Client

app = Flask(__name__)
CORS(app)

# Configure PayPal SDK
paypalrestsdk.configure({
    "mode": "sandbox",
    "client_id": "AaeZMGk38rJjEsfWjlcltlSSdmcvgeAG4mEWv5NEs_IvZAXicfc1b0sRsUQHFNsXsnI041JuOhRhW-5r",
    "client_secret": "EONVhyZGo5L9p7FRiKyeGcFmGPbZ7THjec4d8OQLWvgsKYKiKVBElhd8kznER7moS-acu2JdfkXoZS_O"
})

# Configure Supabase Client
SUPABASE_URL = "https://pyqdueucoboljwdnzwlf.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cWR1ZXVjb2JvbGp3ZG56d2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5ODIzNDMsImV4cCI6MjA1NTU1ODM0M30.4ZI9PugXtfVmOdsFHPUhttFrzCw6nuXk8MBK5FF99Rk"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/api/send-payment', methods=['POST'])
def send_payment():
    data = request.json
    farmer_email = data.get('email')
    amount = data.get('amount')

    if not farmer_email or not amount:
        return jsonify({"error": "Email and amount are required."}), 400

    # Step 1: Check if the farmer email exists in the Supabase farmers table
    try:
        farmer_response = supabase.table('farmers').select('id').eq('email', farmer_email).execute()
        if not farmer_response.data:
            return jsonify({"error": "Farmer email not found in database."}), 404
        
        farmer_id = farmer_response.data[0]['id']
        print(f"✅ Found farmer with ID: {farmer_id} for email: {farmer_email}")
    except Exception as e:
        print(f"❌ Supabase Error (Farmer Lookup): {str(e)}")
        return jsonify({"error": "Failed to verify farmer email."}), 500

    # Step 2: Create the PayPal payout
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

    # Step 3: Try to create the payout
    try:
        if payout.create(sync_mode=False):
            print("✅ PayPal Payout Successful")
            # Step 4: If payment is successful, create a notification in Supabase
            try:
                # Calculate LKR equivalent (1 USD = 300 LKR)
                exchange_rate = 300
                lkr_amount = float(amount) * exchange_rate
                notification_message = f"Payment of ${amount} (approx LKR {int(lkr_amount)}) USD received from Farm to Keels!"
                
                notification_data = {
                    "farmer_id": farmer_id,
                    "message": notification_message,
                    "created_at": time.strftime('%Y-%m-%d %H:%M:%S'),
                    "is_read": False
                }
                print(f"Attempting to insert notification: {notification_data}")
                response = supabase.table('notifications').insert(notification_data).execute()
                print(f"✅ Notification Insert Response: {response}")
            except Exception as e:
                print(f"❌ Supabase Notification Error: {str(e)}")
                return jsonify({"error": f"Payment sent, but failed to create notification: {str(e)}"}), 500

            return jsonify({"message": "Payment sent successfully! Notification created."}), 200
        else:
            print("❌ PayPal Payout Error Details:")
            print(payout.error)
            return jsonify({
                "error": "Payment failed.",
                "details": str(payout.error)
            }), 400
    except Exception as e:
        print(f"❌ Unexpected PayPal Error: {str(e)}")
        return jsonify({
            "error": "Payment failed due to an unexpected error.",
            "details": str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)