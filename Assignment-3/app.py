from flask import Flask
import os
import socket

app = Flask(__name__)

@app.route('/')
def home():
    hostname = socket.gethostname()
    return f"<h1>VCC Hybrid Cloud App</h1><p>Currently running on host: {hostname}</p>"

@app.route('/stress')
def stress_test():
    # Maxes out 4 CPU cores for 300 seconds (5 minutes)
    # Ensure the 'stress' utility is installed on the host OS: sudo apt-get install stress
    os.system("stress --cpu 4 --timeout 300 &")
    return "<h1>Stress Test Initiated!</h1><p>Check the terminal. The auto-scaler should trigger a Cloud Burst to GCP shortly.</p>"

if __name__ == '__main__':
    # Binds to all available interfaces on port 80
    app.run(host='0.0.0.0', port=80)
