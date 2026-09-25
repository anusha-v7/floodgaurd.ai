export type UserRole = 'authority' | 'public';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  badgeId?: string;
  jurisdiction?: string;
}

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface AreaRisk {
  id: string;
  name: string;
  code: string;
  riskLevel: RiskLevel;
  rainfallMmHr: number;
  predictedRainfallMm: number; // 6h forecast
  floodProbability: number; // in percentage, e.g. 91
  waterLevelM: number;
  floodDepthM: number;
  warningLeadTime: string; // e.g. "2h 15m"
  aiConfidence: number; // e.g. 91%
  affectedAreaKm2: number;
  coordinates: [number, number]; // lat, lng
  polygonCoords?: [number, number][];
  recommendedAction: string;
  populationAtRisk: number;
  lastUpdated: string;
}

export type AlertSeverity = 'advisory' | 'warning' | 'critical';

export interface FloodAlert {
  id: string;
  area: string;
  areaId: string;
  severity: AlertSeverity;
  message: string;
  expectedTime: string;
  createdAt: string;
  status: 'active' | 'resolved';
  issuedBy: string;
  floodProbability?: number;
  warningLeadTime?: string;
  source: 'Authority Command' | 'Automated AI Trigger';
}

export type AssetType = 'hospital' | 'school' | 'police' | 'fire' | 'bridge' | 'road' | 'shelter';

export interface CriticalAsset {
  id: string;
  name: string;
  type: AssetType;
  riskLevel: RiskLevel;
  areaId: string;
  areaName: string;
  location: string;
  coordinates: [number, number];
  status: 'operational' | 'alert' | 'inundated';
  details: string;
  elevationM: number;
}

export interface SafeZone {
  id: string;
  name: string;
  location: string;
  distanceKm: number;
  type: 'Emergency Shelter' | 'Higher Ground' | 'Emergency Facility';
  capacity: number;
  currentOccupancy: number;
  coordinates: [number, number];
  contact: string;
  elevationM: number;
  suppliesAvailable: boolean;
}

export interface RainfallTimelinePoint {
  hour: string;
  observedMm: number | null;
  predictedMm: number;
  intensity: 'Light' | 'Moderate' | 'Heavy' | 'Extreme';
  historicalAvgMm: number;
  anomalyMm: number;
}

export interface PredictionTimelinePoint {
  timeStep: string;
  leadHours: number;
  probability: number;
  rainfallMm: number;
  waterLevelM: number;
  riskLevel: RiskLevel;
}

export interface InundationZone {
  id: string;
  areaName: string;
  depthRange: '0–0.5 m' | '0.5–1 m' | '>1 m';
  depthValueM: number;
  affectedAreaKm2: number;
  coordinates: [number, number][];
  color: string;
  riskSeverity: 'low' | 'moderate' | 'high' | 'critical';
}

export interface DataSourceStatus {
  id: string;
  name: string;
  type: 'Satellite' | 'Weather Radar' | 'Weather Stations' | 'NWP Model' | 'Water Level Sensors';
  status: 'connected' | 'simulated' | 'degraded';
  lastSync: string;
  provider: string;
  updateFrequency: string;
  reliability: string;
  isSimulated: boolean;
}

export interface EmergencyActionItem {
  id: string;
  zoneId: string;
  zoneName: string;
  action: string;
  assignedUnit: string;
  priority: 'urgent' | 'high' | 'standard';
  completed: boolean;
}
