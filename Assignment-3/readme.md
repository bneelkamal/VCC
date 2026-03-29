# Hybrid Cloud Auto-Scaling & Cost Optimization

**Course:** Virtualization and Cloud Computing (CSL7510)  
**Author:** Neelkamal Badana  
**Institution:** IIT Jodhpur  

## Project Overview
This repository contains the implementation of a custom Hybrid Cloud Auto-Scaler. The system is designed to host a primary web application on a local on-premise virtual machine and dynamically burst into the Google Cloud Platform (GCP) only when local compute thresholds are exceeded. Once the traffic subsides, the system automatically scales in, terminating the cloud resources to optimize costs.

## Architecture
1. **Baseline Environment:** A local Ubuntu Server (VirtualBox) running a Flask web application (`app.py`).
2. **Telemetry & Automation:** A Python monitoring script (`monitor.py`) using `psutil` to track CPU utilization.
3. **Cloud Bridge:** Authenticated GCP Compute API commands utilizing an IAM Service Account Key.
4. **Cloud Environment:** A standby GCP Compute Engine instance utilizing a metadata startup script (`startup.sh`) for zero-touch provisioning.

### Auto-Scaling Logic (Hysteresis)
* **Scale-Out (Burst):** Triggered when local CPU **> 75%**.
* **Scale-In (Optimization):** Triggered when local CPU **< 30%**.

## Setup & Installation

### Prerequisites
* Python 3.x
* Google Cloud CLI (`gcloud`) installed and configured locally
* Linux `stress` utility (`sudo apt-get install stress`)

### GCP Environment Setup
Before running the local auto-scaler, you must configure the standby cloud environment:

1. **Project & API:** Create a new GCP Project and enable the **Compute Engine API**.
2. **IAM Authentication:** * Create a Service Account with the **Compute Instance Admin (v1)** role.
   * Generate a JSON key, download it, and save it in the root of this repository as `gcp-key.json`.
3. **Provision the Burst VM:**
   * Create a new VM instance named `gcp-burst-vm` (e.g., `e2-micro` in `us-central1-c`).
   * **Crucial Step:** Under the VM's "Custom Metadata", add a new item with the key `startup-script` and paste the contents of `startup.sh` from this repository.
   * Ensure HTTP traffic is allowed through the firewall.
4. **Baseline State:** Once the VM is created, **STOP** the instance so it does not incur billing. The auto-scaler will handle booting it when necessary.

### Local Implementation
1. Clone the repository:
   ```bash
   git clone [URL)
   cd vcc-assignment3
2. Install Python dependencies:

   ```bash
   pip install flask psutil
   
3. Update monitor.py with your specific GCP INSTANCE_NAME, ZONE, and PROJECT_ID.

4. Ensure your gcp-key.json (Service Account Key) is authenticated with your local gcloud CLI.

5. Execution
Run the baseline application:

   ```bash
   sudo python3 app.py

5. In a separate terminal, launch the auto-scaler:

   ```bash
   python3 monitor.py

6. Trigger the stress test by navigating to http://<LOCAL_IP>/stress in your browser.

### ⚠️ Security Notice
Do NOT upload your gcp-key.json or any IAM credentials to this repository. Ensure the .gitignore file remains intact.
