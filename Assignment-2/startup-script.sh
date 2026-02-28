#!/bin/bash
apt-get update
apt-get install -y apache2 stress

systemctl start apache2
systemctl enable apache2

# 1. Fetch Live Metadata
ZONE=$(curl -s -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/zone | awk -F/ '{print $NF}')
INTERNAL_IP=$(curl -s -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/ip)
EXTERNAL_IP=$(curl -s -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip)
MACHINE_TYPE=$(curl -s -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/machine-type | awk -F/ '{print $NF}')
HOST_N=$(hostname)

# 2. Download the decoupled HTML file from Cloud Storage
gsutil cp gs://<YOUR_BUCKET_NAME>/index.html /var/www/html/index.html

# 3. Inject the live metadata variables into the placeholders
sed -i "s/__HOSTNAME__/${HOST_N}/g" /var/www/html/index.html
sed -i "s/__INTERNAL_IP__/${INTERNAL_IP}/g" /var/www/html/index.html
sed -i "s/__EXTERNAL_IP__/${EXTERNAL_IP}/g" /var/www/html/index.html
sed -i "s/__ZONE__/${ZONE}/g" /var/www/html/index.html
sed -i "s/__MACHINE_TYPE__/${MACHINE_TYPE}/g" /var/www/html/index.html
