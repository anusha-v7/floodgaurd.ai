from typing import List, Optional, Literal
from pydantic import BaseModel, Field
from datetime import datetime

class AreaRiskModel(BaseModel):
    id: str
    code: str
    name: str
    riskLevel: Literal['low', 'moderate', 'high', 'critical']
    rainfallMmHr: float
    predictedRainfallMm: float
    floodProbability: float
    waterLevelM: float
    floodDepthM: float
    warningLeadTime: str
    aiConfidence: float
    affectedAreaKm2: float
    coordinates: List[float]
    recommendedAction: str
    populationAtRisk: int
    lastUpdated: str

class AlertCreateRequest(BaseModel):
    area: str
    areaId: Optional[str] = None
    severity: Literal['advisory', 'warning', 'critical']
    message: str
    expectedTime: str
    issuedBy: Optional[str] = "Authority Command Center"
    floodProbability: Optional[float] = 85.0
    warningLeadTime: Optional[str] = "2-3 hours"

class AlertModel(BaseModel):
    id: str
    area: str
    areaId: str
    severity: Literal['advisory', 'warning', 'critical']
    message: str
    expectedTime: str
    createdAt: str
    status: Literal['active', 'resolved']
    issuedBy: str
    floodProbability: Optional[float] = None
    warningLeadTime: Optional[str] = None
    source: str = "Authority Command"

class CriticalAssetModel(BaseModel):
    id: str
    name: str
    type: Literal['hospital', 'school', 'police', 'fire', 'bridge', 'road', 'shelter']
    riskLevel: Literal['low', 'moderate', 'high', 'critical']
    areaId: str
    areaName: str
    location: str
    coordinates: List[float]
    status: Literal['operational', 'alert', 'inundated']
    details: str
    elevationM: float

class PredictionPointModel(BaseModel):
    timeStep: str
    leadHours: int
    probability: float
    rainfallMm: float
    waterLevelM: float
    riskLevel: str

class PredictionResponse(BaseModel):
    areaId: str
    areaName: str
    modelType: str
    isDemo: bool = True
    notice: str = "DEMO MODEL DATA — PyTorch/XGBoost weights can be loaded here"
    confidenceScore: float
    forecastHorizonHours: int
    timeline: List[PredictionPointModel]

class RainfallOverviewModel(BaseModel):
    currentRateMmHr: float
    forecast1hMm: float
    forecast3hMm: float
    forecast6hMm: float
    forecast24hMm: float
    source: str
    isSimulated: bool = True
