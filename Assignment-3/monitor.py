import psutil
import time
import os

# --- GCP CONFIGURATION ---
# Replace these variables with your actual GCP details before running locally.
INSTANCE_NAME = "YOUR_GCP_INSTANCE_NAME" 
ZONE = "YOUR_GCP_ZONE"                   
PROJECT_ID = "YOUR_GCP_PROJECT_ID"       

cloud_is_running = False

print("========================================")
print(" Hybrid Cloud Auto-Scaler Initialized")
print("========================================")
print("Monitoring Local CPU Usage...\n")

while True:
    # Poll CPU utilization every 3 seconds
    cpu_usage = psutil.cpu_percent(interval=3)
    print(f"Current Local CPU: {cpu_usage}%")

    # ==========================================
    # SCALE OUT TRIGGER (CPU > 75%)
    # ==========================================
    if cpu_usage > 75.0 and not cloud_is_running:
        print("\n⚠️ WARNING: Local CPU exceeded 75%!")
        print("🚀 Initiating Cloud Burst to GCP...")
        
        # Execute gcloud CLI command to start the instance
        os.system(f"gcloud compute instances start {INSTANCE_NAME} --zone={ZONE} --project={PROJECT_ID}")
        
        cloud_is_running = True
        print("✅ Cloud VM is booting up. Pausing monitor for 30 seconds to allow startup...")
        time.sleep(30) 

    # ==========================================
    # SCALE IN TRIGGER (CPU < 30%)
    # ==========================================
    elif cpu_usage < 30.0 and cloud_is_running:
        print("\nNotice: Local CPU stabilized below 30%.")
        print("🛑 Scaling in GCP instance to save costs...")
        
        # Execute gcloud CLI command to stop the instance
        os.system(f"gcloud compute instances stop {INSTANCE_NAME} --zone={ZONE} --project={PROJECT_ID}")
        
        cloud_is_running = False
        print("✅ Cloud VM successfully stopped.\n")
