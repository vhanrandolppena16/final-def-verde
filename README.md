# Design of a Machine Learning-Based Model Predictive Control System for Automated Hydroponic Crop Cultivation

A web-based monitoring and decision-support system for automated hydroponic crop cultivation, integrating sensor monitoring, machine learning-based prediction, and model predictive control (MPC) concepts to support optimized crop growth and resource management.

🌐 Live Application

[Open the Hydroponics Monitoring System](https://verde-swart.vercel.app/dashboard)

🔐 Demo Credentials

The application requires login to access the monitoring dashboard.

| Field        | Demo Credential       |
| ------------ | --------------------- |
| **Email**    | `testuser1@gmail.com` |
| **Password** | `@Testuser1`          |

Note: These credentials are provided for demonstration purposes only.

## 📌 Overview

This project presents a **Machine Learning-Based Model Predictive Control System for Automated Hydroponic Crop Cultivation**.

The design solution emphasizes determining the most efficient crop growth parameters based on environmental sensor readings and supervised machine learning algorithms for predictive analysis. The system is designed to monitor important hydroponic environmental and nutrient parameters, analyze sensor readings, predict crop growth-related outcomes, and provide a centralized web interface for monitoring the cultivation environment.

The frontend dashboard provides real-time-style visualization of parameters such as:

* 🌡️ Temperature
* 💧 Humidity
* 🧪 pH
* ⚗️ Total Dissolved Solids (TDS)
* 🌱 Predicted growth information
* 📊 Historical sensor readings and trends

Three alternative machine learning designs were proposed for the predictive analysis component of the system:

* Random Forest (RF)
* AdaBoost
* XGBoost (XGB)

These three supervised machine learning algorithms focus on providing predictive analysis of crop growth based on the environmental conditions observed through the hydroponic sensors.

The original system retrieves data from **Firebase Realtime Database**. For this repository, an exported Firebase dataset is included as a local JSON data source, allowing the frontend to remain functional without requiring access to the original Firebase project.

---

## ✨ Features

### 📊 Dashboard

The dashboard provides an overview of the current hydroponic environment, including:

* Latest temperature reading
* Latest humidity reading
* Latest pH reading
* Latest TDS reading
* Predicted crop growth information
* System status and monitoring information

It also displays the current plant growth stage and a live video feed of the hydroponic system, enabling efficient monitoring and decision-making.

![alt text](https://github.com/vhanrandolppena16/final-def-verde/blob/main/Verde%20-%20Dashboard.png "Verde - Dashboard")

### 📈 Analytics

The analytics page displays a time-series data visualization for key environmental parameters:

* Temperature
* Humidity
* pH
* TDS
* Predicted growth

Users can select either a single specific parameter or multiple ones to visualize their trend and monitor the fluctuations over time. This feature supports data-driven analysis, aiding in identifying patterns within the hydroponic system.

![alt text](https://github.com/vhanrandolppena16/final-def-verde/blob/main/Verde%20-%20Analysis.png "Verde - Analytics")

### 🗃️ Dataset

The dataset interface presents a structured table of recorded sensor readings, including timestamp, temperature, humidity, pH, total dissolved solids, and corresponding predicted growth stage. This feature allows users to track historical data for analysis, validation, monitoring, and research.

![alt text](https://github.com/vhanrandolppena16/final-def-verde/blob/main/Verde%20-%20Data.png "Verde - Data")

### 🎛️ Control

The control page provides the user with an interface to manually control various functions. This provides direct control over various functions when necessary, offering greater flexibility and responsiveness in different situations.

![alt text](https://github.com/vhanrandolppena16/final-def-verde/blob/main/Verde%20-%20Control%20System.png "Verde - Control System")

### 🚨 Alerts

The logs feature provides real-time alerts when sensor measurements fall outside the standard measurements, notifying the user of the potential issues. Additionally, it provides notifications when the values return to normal, allowing the user to monitor the system’s stability.

![alt text](https://github.com/vhanrandolppena16/final-def-verde/blob/main/Verde%20-%20Logs.png "Verde - Logs")

### 🔐 Authentication

The original application includes Firebase Authentication functionality for user login and account management.

> **Note:** The local JSON implementation replaces the Firebase Realtime Database data source, but Firebase Authentication-related functionality remains part of the original frontend architecture.

---

## 🏗️ System Architecture

### Original Architecture

```text
Hydroponic Sensors
       │
       ▼
  Sensor Readings
       │
       ▼
Firebase Realtime Database
       │
       ▼
Machine Learning / MPC System
       │
       ▼
React Web Application
       │
       ├── Dashboard
       ├── Analytics
       ├── Dataset
       └── Alerts
```

### Current Frontend Demo Architecture

Because the original Firebase project is no longer being used for the frontend demo, the exported Firebase data is loaded locally:

```text
Exported Firebase Data
        │
        ▼
verde-firebase-export.json
        │
        ▼
Local Database Service
        │
        ▼
React Web Application
        │
        ├── Dashboard
        ├── Analytics
        ├── Dataset
        └── Alerts
```

This allows the frontend to be demonstrated without depending on the original Firebase Realtime Database.

---

## 🛠️ Technologies Used

### Frontend

* **React**
* **Vite**
* **Tailwind CSS**
* **Material UI (MUI)**
* **Recharts**
* **Lucide React**
* **React Icons**

### Backend / Data Services

* **Firebase**

  * Firebase Authentication
  * Firebase Realtime Database
  * Firestore

* **Machine Learning**
  * Random Forest (RF)
  * AdaBoost
  * XGBoost (XGB)
  * Supervised Machine Learning
  * Predictive Crop Monitoring

* **Control**
  * Model Predictive Control (MPC)
  * Sensor Data Analysis

---

## 📂 Project Structure

```text
final-def-verde-main/
│
└── Frontend/
    │
    ├── public/
    │   └── data/
    │       └── verde-firebase-export.json
    │
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── assets/
    │   ├── localDatabase.js
    │   └── ...
    │
    ├── package.json
    ├── vite.config.js
    └── ...
```

---

## 👨‍💻 Project

**Design of a Machine Learning-Based Model Predictive Control System for Automated Hydroponic Crop Cultivation**

Developed as an academic/project-based system focused on the integration of:

**IoT + Machine Learning + Model Predictive Control + Web Development**
