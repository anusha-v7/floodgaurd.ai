# FLOODGUARD AI
### "Predict. Warn. Respond."
**AI-Powered Flood Early Warning and Inundation Prediction Platform**

---

## 1. Project Structure

```text
floodguard-ai/
├── index.html                   # HTML entry with Leaflet styles & meta tags
├── metadata.json                # Project identity metadata
├── package.json                 # React, Vite, Tailwind CSS, Recharts, Leaflet
├── tsconfig.json                # Strict TypeScript configuration
├── vite.config.ts               # Vite bundler & Tailwind configuration
├── PROJECT_DOCUMENTATION.md     # Full architectural documentation & setup guide
│
├── src/
│   ├── main.tsx                 # React DOM mount point
│   ├── App.tsx                  # Master routing with RBAC layout wrapping
│   ├── index.css                # Global Tailwind CSS imports
│   │
│   ├── types/
│   │   └── index.ts             # Domain models (User, AreaRisk, Alert, Assets, etc.)
│   │
│   ├── data/
│   │   └── floodGuardData.ts    # Centralized demo & telemetry data store
│   │
│   ├── context/
│   │   └── AuthContext.tsx      # RBAC session manager & credentials
│   │
│   ├── services/
│   │   ├── alertService.ts      # Reactive pub/sub alert store (Firestore simulation)
│   │   └── responseService.ts   # Tactical emergency action dispatch tracker
│   │
│   ├── utils/
│   │   └── mapUtils.ts          # Leaflet icon generators & color scales
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.tsx  # Unauthenticated redirect guard
│   │   │   └── AuthorityRoute.tsx  # Role-Based Access Control ("authority" only)
│   │   ├── common/
│   │   │   ├── RiskBadge.tsx       # Accessible status pill (Green/Yellow/Orange/Red)
│   │   │   └── SimulatedBanner.tsx # Transparent DEMO / Model Data indicator
│   │   ├── public/
│   │   │   ├── PublicNavbar.tsx    # Citizen navigation with active ticker
│   │   │   └── PublicFooter.tsx    # Hotlines & regional contacts
│   │   ├── authority/
│   │   │   ├── AuthoritySidebar.tsx# Collapsible command center sidebar
│   │   │   ├── AuthorityTopBar.tsx # Ticking IST clock & status pulse
│   │   │   └── ZoneDetailsModal.tsx# Telemetry drawer & alert dispatcher
│   │   └── maps/
│   │       ├── PublicRiskMapComponent.tsx    # Leaflet public safety map
│   │       └── AuthorityRiskMapComponent.tsx # High-density operational map
│   │
│   ├── layouts/
│   │   ├── PublicLayout.tsx     # Light, trustworthy citizen wrapper
│   │   └── AuthorityLayout.tsx  # Dark command center wrapper
│   │
│   └── pages/
│       ├── public/
│       │   ├── LandingPage.tsx      # Hero, pipeline, why FloodGuard AI
│       │   ├── AboutPage.tsx        # Technical architecture & SIH mission
│       │   ├── PublicHomePage.tsx   # Top warning banner & quick navigation
│       │   ├── PublicMyAreaPage.tsx # Area search, probability, water level
│       │   ├── PublicRiskMapPage.tsx# Simplified citizen risk map
│       │   ├── PublicAlertsPage.tsx # Live sync of authority broadcasts
│       │   ├── PublicSafeZonesPage.tsx # Shelters, higher ground, distance
│       │   └── PublicSafetyPage.tsx # 72-hr go-kit & flood protocols
│       └── authority/
│           ├── AuthorityLoginPage.tsx      # Command center login & RBAC tester
│           ├── AuthorityDashboardPage.tsx  # 4 KPI cards, live map, AI forecast
│           ├── AuthorityRiskMapPage.tsx    # Full-screen operational GIS map
│           ├── AuthorityRainfallPage.tsx   # Hyetograph, anomaly & forecast curves
│           ├── AuthorityInundationPage.tsx # Depth-stratified pooling (0-0.5m, >1m)
│           ├── AuthorityPredictionsPage.tsx# ML probability progression curve
│           ├── AuthorityAlertsPage.tsx     # Broadcast creator syncing to public
│           ├── AuthorityRiskAreasPage.tsx  # Filterable catchment data table
│           ├── AuthorityAssetsPage.tsx     # Hospitals, bridges & schools at risk
│           ├── AuthorityDataSourcesPage.tsx# Radar, satellite, AWS pipeline status
│           ├── AuthorityAnalyticsPage.tsx  # Honest metrics notice & decadal rain
│           ├── AuthorityResponsePage.tsx   # Tactical SOP dispatch checklist
│           └── AuthorityProfilePage.tsx    # Official credentials & privileges
│
└── backend/
    ├── requirements.txt         # FastAPI, Uvicorn, Pydantic
    ├── main.py                  # FastAPI REST endpoints
    ├── models/
    │   └── schemas.py           # Pydantic data schemas
    └── services/
        └── mock_prediction_service.py # Hydrological prediction simulation logic
```

---

## 2. Setup Instructions

### Prerequisites
- Node.js 18+ (for frontend Vite build)
- Python 3.10+ (for FastAPI backend)

---

## 3. Environment Variables Required

Create `.env` in the root folder for frontend overrides:
```bash
# Optional API configuration
VITE_API_URL="http://localhost:8000"
VITE_ENABLE_MOCK_FALLBACK="true"
```

For the backend, create `backend/.env`:
```bash
PORT=8000
HOST="0.0.0.0"
CORS_ORIGINS="http://localhost:3000,http://localhost:5173"
ML_MODEL_PATH="./weights/hydro_convlstm_v2.pt"
```

---

## 4. Firebase Setup Steps

When deploying to a production Firebase instance:
1. Open the [Firebase Console](https://console.firebase.google.com/) and create a project (e.g. `floodguard-ai`).
2. Enable **Firebase Authentication** with **Email/Password** and/or **Google Auth**.
3. Create a **Cloud Firestore** database.
4. Set up collection `users`:
   ```json
   {
     "uid": "officer_001",
     "name": "Dr. Rajesh Rao",
     "email": "authority@floodguard.gov",
     "role": "authority",
     "department": "State Disaster Management Authority"
   }
   ```
5. Deploy `firestore.rules`:
   ```text
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /alerts/{alertId} {
         allow read: if true; // Public citizens can read alerts
         allow write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'authority';
       }
       match /users/{userId} {
         allow read: if request.auth != null && request.auth.uid == userId;
         allow write: if false; // Managed by admin/auth provisioning
       }
     }
   }
   ```

---

## 5. Backend Setup Steps

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   python main.py
   # Or using uvicorn directly:
   uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
   ```
5. Interactive OpenAPI docs will be accessible at:
   `http://localhost:8000/docs`

---

## 6. Frontend Setup Steps

1. From the project root, install packages:
   ```bash
   npm install
   ```
2. Start the Vite development server on port 3000:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your web browser.

---

## 7. How to Create & Test an Authority User

The application has built-in Role-Based Access Control (RBAC):

### Preset Demo Accounts:
- **Authority Officer Credentials:**
  - Email: `authority@floodguard.gov`
  - Password: `authority123`
  - Role: `authority` (Grants full access to all `/authority/*` routes)
- **Public Citizen Credentials (for testing RBAC denial):**
  - Email: `citizen@example.com`
  - Password: `public123`
  - Role: `public`

### Testing RBAC Enforcement:
1. Navigate to `/authority/login`.
2. Click **"Test RBAC: Login as Citizen (Simulate Denied Access)"**.
3. Notice that when attempting to view `/authority/dashboard`, the system intercepts the session and presents the **Access Restricted: Authority Credentials Required** guard screen.
4. Click **"Switch to Demo Authority Officer Account"** or login with `authority@floodguard.gov` to instantly gain command access.

---

## 8. How to Run the Complete Application

1. **Terminal 1 (Backend):**
   ```bash
   uvicorn backend.main:app --port 8000 --reload
   ```
2. **Terminal 2 (Frontend):**
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000`.

---

## 9. How to Deploy

### Frontend (Netlify / Vercel):
- Build command: `npm run build`
- Output directory: `dist`
- Route rewrite for single-page routing:
  - Create `dist/_redirects` or `netlify.toml`:
    ```toml
    [[redirects]]
      from = "/*"
      to = "/index.html"
      status = 200
    ```

### Backend (Render / Cloud Run / AWS ECS):
- Containerize using Docker:
  ```dockerfile
  FROM python:3.11-slim
  WORKDIR /app
  COPY backend/requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt
  COPY backend/ ./backend/
  CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
  ```

---

## 10. Demo Data vs. Real APIs & ML Connection Points

| Component | Current Mode | Real Connection Point |
| :--- | :--- | :--- |
| **Rainfall Telemetry** | Centralized demo data (86 mm/hr peak) | Connect IMD Doppler Radar API / MOSDAC INSAT-3DR HDF5 ingest script in `backend/main.py:get_rainfall()` |
| **AI Flood Probability** | Temporal simulation curves | Replace `backend/services/mock_prediction_service.py:get_prediction_for_area()` with PyTorch `model.forward(tensor_inputs)` |
| **Inundation Mapping** | GeoJSON polygons in `INUNDATION_ZONES` | Replace static coordinates with GeoServer WMS/WFS layer or HEC-RAS 2D water depth shapefiles |
| **Emergency Alerts** | Reactive pub/sub in `alertService.ts` | Replace `localStorage` operations with Firebase `collection(db, 'alerts')` and `onSnapshot()` |
| **Authentication & RBAC** | LocalStorage + AuthContext role verification | Connect `signInWithEmailAndPassword` or `signInWithPopup(auth, googleProvider)` and verify `doc(db, 'users', uid).role` |
| **Model Evaluation Metrics** | Honest disclaimer ("Awaiting validation") | Once test fold cross-validation is completed on historical deluge data, populate MAE/RMSE/F1 in `/authority/analytics` |
