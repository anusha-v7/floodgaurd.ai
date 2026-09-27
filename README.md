🌊 FloodGuard AI
"Predict. Warn. Respond."

Next-Generation AI-Powered Flood Early Warning & Inundation Prediction Platform

🏆 Built for the Smart India Internal Hackathon

Theme: Disaster Management & Smart Governance

📌 Executive Summary

Traditional flood warning systems rely on reactive river-gauge threshold measurements—often giving disaster response teams and citizens less than an hour to react after rivers breach their banks.
FloodGuard AI changes this paradigm from reactive monitoring to predictive intelligence. Developed during the Smart India Internal Hackathon, FloodGuard AI ingests meteorological feeds, radar precipitation forecasts, digital elevation models (DEM), and hydrological basin characteristics to predict urban and riverine inundation 3 to 6 hours before water accumulates on streets.
The platform is designed around a dual-portal architecture:
Public Citizen Portal (Zero-Friction & Open Access): Provides affected communities with life-saving warnings, localized risk assessment, safe elevation zones, and verified shelter locations without requiring any login.
Authority Command Center (Role-Protected & Operational): Equips State Disaster Management Authorities (SDMA), municipal emergency cells, and NDRF/SDRF commanders with real-time ML risk maps, alert dispatch capabilities, and tactical Standard Operating Procedure (SOP) trackers.

⚙️ How FloodGuard AI Works
code
Text
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
 │ Multi-Sensor Telemetry│    │   Hydrological & ML  │    │  Real-Time Cloud DB  │
 │ • Doppler Radar (IMD) │───▶│   Inundation Engine  │───▶│   Google Firestore   │
 │ • AWS Rainfall Gauges │    │ • Runoff Coefficient │    │ • /alerts (Realtime) │
 │ • Ultrasonic Sensors  │    │ • Topographic DEM    │    │ • /emergency_actions │
 └──────────────────────┘    │ • Lead-Time & Depth  │    └──────────┬───────────┘
                             └──────────────────────┘               │
                                                                    ▼
        ┌───────────────────────────────────────────────────────────┴────────────────────────┐
        ▼                                                                                    ▼
 ┌──────────────────────────────────────────────┐     ┌──────────────────────────────────────────────┐
 │           PUBLIC CITIZEN PORTAL              │     │          AUTHORITY COMMAND CENTER            │
 │  (Open Access • No Authentication Needed)    │     │  (Protected via Firebase Auth & Role RBAC)   │
 │                                              │     │                                              │
 │ • Real-Time Emergency Ticker & Active Alerts │     │ • Real-Time Multi-Sensor Telemetry Grid      │
 │ • "Check My Area" Risk Search                │     │ • 1h, 3h, 6h, 24h Precipitation Curve Models │
 │ • Color-Coded Inundation Risk Map            │     │ • Official Cell-Broadcast Alert Dispatch     │
 │ • Safe High-Ground Shelters & Evac Routes    │     │ • Emergency Response Unit SOP Mobilization   │
 │ • Regional Emergency Helpline Directory      │     │ • Municipal Basin Inundation Depth Simulator │
 └──────────────────────────────────────────────┘     └──────────────────────────────────────────────┘
 
1. Telemetry & Ingestion
The system aggregates meteorological and hydrological data points:
Satellite precipitation estimations and Doppler radar reflectivities.
Automatic Weather Station (AWS) precipitation totals (1h, 3h, 6h, 24h).
Digital Elevation Model (DEM) slope calculations and soil saturation runoff indices.
Ultrasonic ultrasonic river and canal discharge levels.

3. AI Hydrological & Inundation Prediction Engine
Computes flood probability scores (
) for every vulnerable ward and catchment zone.
Forecasts inundation depth tiers:
🟢 Advisory / Low Risk: 
 (localized waterlogging).
🟡 Warning / Moderate Risk: 
 (arterial road blockages).
🔴 Critical / Severe Risk: 
 (rapid residential inundation).
Derives early warning lead times (
 advance notice).

5. Dual-Experience Interfaces
For Citizens: Simple, high-contrast, uncluttered UI optimized for high-stress emergency conditions. Available instantly without any sign-up barrier.
For Disaster Authorities: High-density command console with Leaflet geospatial overlays, sensor telemetry charts (Recharts), and alert broadcast controls.

7. Cloud Synchronization & Alert Dispatch
When an authority issues an alert from the Command Center, it writes directly to Google Cloud Firestore.
Active alerts propagate instantaneously across all connected citizen portals using real-time Firestore listeners (onSnapshot), triggering the emergency broadcast ticker and visual hazard banners.

✨ Key Platform Features

🏛️ Public Citizen Portal

Check My Area: Type or select any local ward or landmark (e.g., Bellary Urban, Cantonment, Cowl Bazaar, APMC Yard) to get instant risk percentages, predicted peak water levels, and actionable advice.
Interactive Risk Map: Explore full-screen GIS maps displaying inundation danger zones, water depth contour heatmaps, and flood hazard boundaries.
Safe High Ground & Evacuation Shelters: Directs citizens to nearby municipal relief shelters with capacity indicators, elevation statistics, and verified navigation routes.
Active Advisory Feeds: Chronological feed of official government advisories with severity badges and authority attribution.
Emergency Safety Guide: Pre-flood, during-flood, and post-flood survival protocols, do's and don'ts, and direct emergency helpline hotlines (112, 1070, 1077).

🛡️ Authority Command Center

Operational Overview: Instant situational awareness showing high-risk zones, active alerts, mobilized response teams, and average lead times.
Predictive Inundation Modeler: Inundation depth simulation across basins based on rainfall intensities.
Alert Management System: Draft, validate, issue, and resolve official flood alerts with severity classification, affected population metrics, and customizable messages.
Tactical Response Coordination: Standard Operating Procedure (SOP) dispatch checklist for NDRF, SDRF, civil defense, and fire & rescue units.
Telemetry & Sensor Health: Real-time diagnostics for radar feeds, AWS stations, and ultrasonic stream gauges.

🔒 Security & Authentication Architecture

Feature	Public Portal	Authority Command Center
Authentication	None (Publicly Accessible)	Firebase Authentication (Email/Password)
Role Verification	None	Firestore users/{uid} with role: "authority"
Route Protection	Open to all visitors	Guarded by AuthorityRoute component
Database Permissions	Read-only access to /alerts	Read/Write to /alerts, /emergency_actions, and /users
Privilege Escalation	Strictly prevented by Firestore Security Rules	Verified via secure security rules & auth token

💻 Tech Stack

Frontend Core: React 19, TypeScript, Vite
Styling & Design System: Tailwind CSS, modern responsive design
Geospatial & Mapping: Leaflet, React-Leaflet
Data Visualizations: Recharts (Rainfall curves, runoff hydrographs, sensor trends)
Cloud Backend & Database: Google Cloud Firestore (Real-time NoSQL)
Identity & Access Management: Firebase Authentication
Icons & Graphics: Lucide React

🚀 Getting Started & Local Development
Prerequisites
Node.js (version 18 or higher)
npm or bun
1. Clone the repository
code
Bash
git clone https://github.com/your-username/floodguard-ai.git
cd floodguard-ai
2. Install dependencies
code
Bash
npm install
3. Start development server
code
Bash
npm run dev
The app will be accessible at https://floodgaurd-ai.netlify.app/public/safety
4. Build for production
code
Bash
npm run build

🧪 Evaluation & Demo Credentials
For hackathon judges and evaluators reviewing the platform:
1. Public Portal (No login required)
Navigate directly to / or /public
Test the Check My Area, Risk Map, Safe Zones, and Safety Guide features freely.
2. Authority Command Center (Authentication required)
Navigate to /authority/login
Email: authority@floodguard.gov
Password: authority123
(Alternatively, click the "1-Click Sign in as Authority Officer" button on the login screen for instant evaluation).
Navigate to /authority/alerts to create and broadcast an emergency alert, then view it update in real time on the Public Portal at /public/alerts!

👥 Hackathon Team & Acknowledgments
Hackathon: Smart India Internal Hackathon
Domain: AI for Disaster Management, Climate Resilience & Urban Hydrology
Special Thanks: State Disaster Management Authority guidelines, Indian Meteorological Department (IMD) open hydrological modeling principles, and hackathon mentors.
FloodGuard AI — Empowering disaster responders and protecting vulnerable communities through intelligent early warning.
