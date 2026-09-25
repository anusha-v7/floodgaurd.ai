"""
FloodGuard AI - Hydrological Prediction & Telemetry Service
============================================================
This service generates realistic simulated hydrological predictions.
When connecting the real ML model, replace the demo generator functions
with the loaded model checkpoint (e.g., PyTorch ConvLSTM or XGBoost regressor).
"""

from typing import List, Dict, Any
from datetime import datetime
from backend.models.schemas import (
    AreaRiskModel,
    AlertModel,
    CriticalAssetModel,
    PredictionResponse,
    PredictionPointModel,
    RainfallOverviewModel,
    AlertCreateRequest
)

# In-memory storage mimicking Firestore/database
ALERTS_DB: List[AlertModel] = [
    AlertModel(
        id="alert-001",
        area="Bellary Urban (Old Town & Fort Basin)",
        areaId="bellary-urban-old",
        severity="critical",
        message="Heavy rainfall exceeding 96 mm/hr may cause rapid inundation in low-lying residential sectors. Move to designated emergency shelters immediately.",
        expectedTime="Next 2–3 hours",
        createdAt="25 mins ago",
        status="active",
        issuedBy="SDMA Emergency Command Center",
        floodProbability=84.0,
        warningLeadTime="2h 30m"
    ),
    AlertModel(
        id="alert-002",
        area="Zone A (Central Lowland Catchment)",
        areaId="zone-a",
        severity="critical",
        message="Runoff convergence reaching critical threshold (3.8m water level). Flood depth exceeding 1.2m expected in low-lying streets.",
        expectedTime="Next 2 hours",
        createdAt="40 mins ago",
        status="active",
        issuedBy="State Disaster Management Authority",
        floodProbability=91.0,
        warningLeadTime="2h 15m"
    ),
    AlertModel(
        id="alert-003",
        area="Zone B (Tungabhadra Canal Outflow)",
        areaId="zone-b",
        severity="critical",
        message="Canal spillover alert issued. North bund reinforcement in progress. Avoid crossing low bridges.",
        expectedTime="Next 2h 40m",
        createdAt="1 hour ago",
        status="active",
        issuedBy="Irrigation & Drainage Command",
        floodProbability=86.0,
        warningLeadTime="2h 40m"
    )
]

AREAS_DB: List[AreaRiskModel] = [
    AreaRiskModel(
        id="zone-a",
        code="ZONE-A",
        name="Zone A (Central Lowland Catchment)",
        riskLevel="critical",
        rainfallMmHr=86.0,
        predictedRainfallMm=142.0,
        floodProbability=91.0,
        waterLevelM=3.8,
        floodDepthM=1.2,
        warningLeadTime="2h 15m",
        aiConfidence=91.0,
        affectedAreaKm2=2.4,
        coordinates=[15.145, 76.921],
        recommendedAction="Prepare emergency response in low-lying areas. Stage evacuation transport at Sector 4.",
        populationAtRisk=3400,
        lastUpdated="10 mins ago"
    ),
    AreaRiskModel(
        id="zone-b",
        code="ZONE-B",
        name="Zone B (Tungabhadra Canal Outflow)",
        riskLevel="critical",
        rainfallMmHr=92.0,
        predictedRainfallMm=128.0,
        floodProbability=86.0,
        waterLevelM=4.1,
        floodDepthM=1.4,
        warningLeadTime="2h 40m",
        aiConfidence=89.0,
        affectedAreaKm2=1.4,
        coordinates=[15.162, 76.908],
        recommendedAction="Coordinate sluice gate drainage; deploy sandbagging squads near North bund.",
        populationAtRisk=2200,
        lastUpdated="8 mins ago"
    ),
    AreaRiskModel(
        id="bellary-urban-old",
        code="ZONE-BU-OLD",
        name="Bellary Urban (Old Town & Fort Basin)",
        riskLevel="critical",
        rainfallMmHr=96.0,
        predictedRainfallMm=154.0,
        floodProbability=84.0,
        waterLevelM=3.4,
        floodDepthM=1.1,
        warningLeadTime="2h 30m",
        aiConfidence=93.0,
        affectedAreaKm2=1.8,
        coordinates=[15.139, 76.925],
        recommendedAction="Activate Old Town drainage pumps; issue broadcast alert to commercial market area.",
        populationAtRisk=1950,
        lastUpdated="5 mins ago"
    ),
    AreaRiskModel(
        id="zone-c",
        code="ZONE-C",
        name="Zone C (Kudligi Canal Corridor)",
        riskLevel="high",
        rainfallMmHr=68.0,
        predictedRainfallMm=104.0,
        floodProbability=72.0,
        waterLevelM=2.7,
        floodDepthM=0.7,
        warningLeadTime="4h 00m",
        aiConfidence=87.0,
        affectedAreaKm2=2.1,
        coordinates=[15.158, 76.945],
        recommendedAction="Monitor water clearance rate at downstream culverts and reroute school buses.",
        populationAtRisk=1400,
        lastUpdated="15 mins ago"
    ),
    AreaRiskModel(
        id="zone-d",
        code="ZONE-D",
        name="Zone D (Southern Agrarian Valley)",
        riskLevel="moderate",
        rainfallMmHr=42.0,
        predictedRainfallMm=76.0,
        floodProbability=48.0,
        waterLevelM=1.8,
        floodDepthM=0.3,
        warningLeadTime="6h 00m",
        aiConfidence=82.0,
        affectedAreaKm2=3.2,
        coordinates=[15.112, 76.915],
        recommendedAction="Advise livestock relocation to higher ground; inspect field run-off channels.",
        populationAtRisk=650,
        lastUpdated="22 mins ago"
    )
]

def get_rainfall_overview() -> RainfallOverviewModel:
    return RainfallOverviewModel(
        currentRateMmHr=86.0,
        forecast1hMm=34.0,
        forecast3hMm=76.0,
        forecast6hMm=142.0,
        forecast24hMm=218.0,
        source="Doppler Weather Radar (DWR) + IMD AWS Telemetric Fusion",
        isSimulated=True
    )

def get_prediction_for_area(area_id: str) -> PredictionResponse:
    target_area = next((a for a in AREAS_DB if a.id == area_id), AREAS_DB[0])
    
    # 6-step temporal sequence
    timeline = [
        PredictionPointModel(timeStep="T+00h", leadHours=0, probability=12.0, rainfallMm=86.0, waterLevelM=2.1, riskLevel="low"),
        PredictionPointModel(timeStep="T+01h", leadHours=1, probability=21.0, rainfallMm=104.0, waterLevelM=2.6, riskLevel="moderate"),
        PredictionPointModel(timeStep="T+02h", leadHours=2, probability=39.0, rainfallMm=122.0, waterLevelM=3.1, riskLevel="high"),
        PredictionPointModel(timeStep="T+03h", leadHours=3, probability=58.0, rainfallMm=142.0, waterLevelM=3.6, riskLevel="high"),
        PredictionPointModel(timeStep="T+04h", leadHours=4, probability=76.0, rainfallMm=125.0, waterLevelM=4.0, riskLevel="critical"),
        PredictionPointModel(timeStep="T+05h", leadHours=5, probability=89.0, rainfallMm=95.0, waterLevelM=4.3, riskLevel="critical"),
    ]

    return PredictionResponse(
        areaId=target_area.id,
        areaName=target_area.name,
        modelType="Hydro-ConvLSTM-v2 (Prototype Demo Weights)",
        isDemo=True,
        confidenceScore=target_area.aiConfidence,
        forecastHorizonHours=6,
        timeline=timeline
    )

def add_alert(req: AlertCreateRequest) -> AlertModel:
    new_alert = AlertModel(
        id=f"alert-{int(datetime.utcnow().timestamp())}",
        area=req.area,
        areaId=req.areaId or req.area.lower().replace(" ", "-"),
        severity=req.severity,
        message=req.message,
        expectedTime=req.expectedTime,
        createdAt="Just now",
        status="active",
        issuedBy=req.issuedBy or "Authority Command Center",
        floodProbability=req.floodProbability,
        warningLeadTime=req.warningLeadTime
    )
    ALERTS_DB.insert(0, new_alert)
    return new_alert
