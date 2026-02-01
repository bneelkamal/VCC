# Microservices Architecture on VirtualBox

**NEELKAMAL BADANA**  
Virtualization and Cloud Computing  
Assignment 1 - Create Multiple VMs, Connect These VMs, and Host One Microservice-Based Application

---

## 📌 Project Overview
This repository contains the source code and deployment configuration for a decoupled microservices application. The project demonstrates a **Reverse Proxy Architecture** deployed on two isolated Ubuntu Virtual Machines (VMs) using Oracle VirtualBox.

The system consists of a public-facing **API Gateway** that securely communicates with a private **Backend Logic Service** to display real-time system diagnostics (CPU, RAM, Uptime) on a dynamic dashboard.

---

## 🏗️ System Architecture

| **Node** | **VM Name** | **Role** | **IP Address** | **Port** |
| :--- | :--- | :--- | :--- | :--- |
| **VM 1** | `User-Gateway-VM` ("Beast") | **Frontend Gateway** | `10.0.2.15` | `3000` |
| **VM 2** | `Logic-Service-VM` ("Beauty") | **Backend Logic** | `10.0.2.4` | `4000` |

### **Communication Flow:**
1.  **User** accesses the dashboard via `http://localhost:3000` (Host Machine).
2.  **Gateway Service** (VM 1) receives the request.
3.  **Gateway** acts as a proxy and requests secure data from the **Logic Service** (VM 2) via the internal network (`10.0.2.4:4000`).
4.  **Logic Service** calculates system stats and returns JSON.
5.  **Gateway** renders the HTML dashboard and sends it back to the User.

---

## ⚙️ Deployment Configuration

To replicate this setup, configure your VirtualBox environment as follows:

### **1. Prerequisites**
* **Hypervisor:** Oracle VirtualBox 7.2.6 (or newer)
* **OS Image:** Ubuntu Server 24.04.3 LTS
* **Runtime:** Node.js (`sudo apt install nodejs npm`)

### **2. Network Strategy**
* **Adapter 1 (Enabled on BOTH VMs):**
    * **Attached to:** `NAT Network`
    * **Purpose:** Places both VMs on the same private subnet (`10.0.2.x`) for internal communication.
* **Adapter 2 (Enabled on GATEWAY VM ONLY):**
    * **Attached to:** `NAT`
    * **Port Forwarding:** Host Port `3000` -> Guest Port `3000`.
    * **Purpose:** Allows external access from the browser.

---

## 🚀 How to Run

### **Step 1: Start the Backend (VM 2)**
Login to `Logic-Service-VM` and run: `node logic.js`

Server will start on Port 4000.

### **Step 2: Start the Gateway (VM 1)**
Login to User-Gateway-VM and run: `node gateway.js`
Server will start on Port 3000.

### **Step 3: Access the Application**
Open your browser on the Host Machine and visit: `http://localhost:3000`

---

## 📂 **File Structure**

**gateway.js** - The frontend server code (Reverse Proxy & HTML generation).

**logic.js** - The backend server code (System stats calculation & JSON response).

**README.md** - Deployment documentation.
