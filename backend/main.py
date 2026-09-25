"""
FloodGuard AI - FastAPI Backend Server
======================================
Provides RESTful APIs for rainfall telemetry, probabilistic flood predictions,
critical infrastructure monitoring, and real-time emergency alert dispatch.
"""

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional

from backend.models.schemas import (
    AreaRiskModel,
    AlertModel,
    AlertCreateRequest,
    PredictionResponse,
    RainfallOverviewModel
)
from backend.services.mock_prediction_service import (
    ALERTS_DB,
    AREAS_DB,
    get_rainfall_overview,
    get_prediction_for_area,
    add_alert
)

app = FastAPI(
    title="FloodGuard AI API",
    description="Backend microservice for AI-powered flood early warning and inundation predictions.",
    version="1.2.0"
)

# CORS Configuration for frontend dev and deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev and cloud previews
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", summary="Health check")
def health_check():
    return {
        "status": "online",
        "service": "FloodGuard AI Backend",
        "mode": "PROTOTYPE / DEMO SIMULATION",
        "mlModelLoaded": False,
        "mlEngine": "Hydro-ConvLSTM Mock Adapter"
    }

@app.get("/rainfall", response_model=RainfallOverviewModel, summary="Get regional rainfall telemetry")
def get_rainfall():
    return get_rainfall_overview()

@app.get("/risk", summary="Get consolidated risk summary")
def get_risk_summary():
    return {
        "criticalCount": sum(1 for a in AREAS_DB if a.riskLevel == 'critical'),
        "highRiskCount": sum(1 for a in AREAS_DB if a.riskLevel == 'high'),
        "monitoredZones": len(AREAS_DB),
        "peakFloodProbability": max(a.floodProbability for a in AREAS_DB),
        "primaryAtRiskArea": "Bellary Urban Old Town & Zone A"
    }

@app.get("/prediction", response_model=PredictionResponse, summary="Get AI flood probability prediction for an area")
def get_prediction(area_id: str = Query(default="zone-a", description="Unique code or id of the catchment area")):
    return get_prediction_for_area(area_id)

@app.get("/inundation", summary="Get micro-elevation inundation depth zones")
def get_inundation_zones():
    return {
        "affectedAreaKm2": 3.8,
        "maxDepthM": 1.4,
        "estimatedTimeToPeakHours": 3,
        "layers": [
            {"depthRange": ">1 m", "areaKm2": 1.2, "severity": "critical", "color": "#ef4444"},
            {"depthRange": "0.5–1 m", "areaKm2": 1.6, "severity": "high", "color": "#f97316"},
            {"depthRange": "0–0.5 m", "areaKm2": 1.0, "severity": "moderate", "color": "#eab308"}
        ],
        "isSimulated": True
    }

@app.get("/alerts", response_model=List[AlertModel], summary="List active emergency alerts")
def get_alerts(status: Optional[str] = None):
    if status:
        return [a for a in ALERTS_DB if a.status == status]
    return ALERTS_DB

@app.post("/alerts", response_model=AlertModel, status_code=status.HTTP_201_CREATED, summary="Create emergency broadcast alert")
def create_alert(req: AlertCreateRequest):
    new_alert = add_alert(req)
    return new_alert

@app.get("/areas", response_model=List[AreaRiskModel], summary="List monitored catchment areas")
def get_areas():
    return AREAS_DB

@app.get("/assets", summary="List critical infrastructure lifelines at risk")
def get_assets():
    return {
        "totalAssetsMonitored": 10,
        "atRiskCount": 4,
        "facilities": [
            {"name": "District General Hospital", "type": "hospital", "risk": "high", "accessSubmerged": False},
            {"name": "LifeCare Trauma Center", "type": "hospital", "risk": "critical", "barrierDeployed": True},
            {"name": "Tungabhadra Link Bridge B", "type": "bridge", "risk": "critical", "clearanceM": 0.35},
            {"name": "NH-67 km 14.2 Sector Cut", "type": "road", "risk": "critical", "status": "inundated"}
        ]
    }

@app.get("/analytics", summary="Get model metrics and historical flood frequency")
def get_analytics():
    return {
        "modelEvaluationStatus": "PENDING_VALIDATION",
        "notice": "Model evaluation metrics will appear after model validation.",
        "metrics": None,
        "historicalMonsoonRainfall": [
            {"year": "2020", "rainfallMm": 840, "floodDays": 6},
            {"year": "2021", "rainfallMm": 920, "floodDays": 8},
            {"year": "2022", "rainfallMm": 1150, "floodDays": 14},
            {"year": "2023", "rainfallMm": 780, "floodDays": 5},
            {"year": "2024", "rainfallMm": 1020, "floodDays": 11},
            {"year": "2025", "rainfallMm": 1280, "floodDays": 16},
            {"year": "2026", "rainfallMm": 940, "floodDays": 12}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
