#Virtualization and Cloud Computing
#Assignment 2: Auto-Scaling and Security Configuration in GCP
NEELKAMAL BADANA

## Overview
This repository contains the deployment scripts and configuration files for VCC Assignment 2. The project demonstrates a highly available, auto-scaling web application environment deployed on Google Cloud Platform (GCP).

## Architecture Highlights
* **Decoupled Storage (Cattle vs. Pets):** Web assets (`index.html`) are not hardcoded into the VM. They are securely hosted in a Cloud Storage bucket and fetched dynamically via a startup script upon boot.
* **Auto-Scaling:** A Managed Instance Group (MIG) configured to dynamically scale from 1 to 3 virtual machines based on a 60% CPU utilization threshold.
* **Security & IAM:** * Implementation of a custom IAM Service Account with restricted privileges (Storage Object Viewer, Logs/Metrics Writer).
  * Strict VPC Firewall rules allowing only global HTTP traffic (port 80) and secure IAP-tunneled SSH access (port 22).

## Repository Contents
* `index.html`: The custom frontend dashboard that dynamically displays live GCP compute metadata.
* `startup-script.sh`: The bash script executed by the Instance Template. It installs Apache2, downloads the web code from Cloud Storage via `gsutil`, and injects live server metadata using `sed`.

## Testing the Auto-Scaler
To verify the auto-scaling policy, SSH into the primary instance and artificially spike the CPU utilization by executing:
\`\`\`bash
stress --cpu 4 --timeout 180
\`\`\`
Within two minutes, the GCP autoscaler will detect the load and automatically provision additional instances to distribute the traffic.
