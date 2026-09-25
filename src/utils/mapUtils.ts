import L from 'leaflet';
import { RiskLevel, AssetType } from '../types';

export const getRiskColor = (level: RiskLevel): string => {
  switch (level) {
    case 'critical':
      return '#ef4444'; // Red
    case 'high':
      return '#f97316'; // Orange
    case 'moderate':
      return '#eab308'; // Yellow
    case 'low':
      return '#10b981'; // Green
    default:
      return '#3b82f6';
  }
};

export const createRiskZoneIcon = (level: RiskLevel, label?: string) => {
  const color = getRiskColor(level);
  const pulseClass = level === 'critical' ? 'animate-ping' : '';

  return L.divIcon({
    className: 'custom-risk-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
        <span style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background-color: ${color}; opacity: 0.35;" class="${pulseClass}"></span>
        <span style="position: relative; width: 22px; height: 22px; border-radius: 9999px; background-color: ${color}; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; color: white;">
          ${label ? label.slice(0, 2) : '!'}
        </span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
};

export const createAssetIcon = (type: AssetType, risk: RiskLevel) => {
  const color = getRiskColor(risk);
  let emoji = '📍';
  if (type === 'hospital') emoji = '🏥';
  else if (type === 'bridge') emoji = '🌉';
  else if (type === 'school') emoji = '🏫';
  else if (type === 'police') emoji = '👮';
  else if (type === 'fire') emoji = '🚒';
  else if (type === 'road') emoji = '🛣️';
  else if (type === 'shelter') emoji = '🏕️';

  return L.divIcon({
    className: 'custom-asset-marker',
    html: `
      <div style="background-color: #0f172a; border: 2px solid ${color}; border-radius: 8px; padding: 3px 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 600; color: white;">
        <span>${emoji}</span>
      </div>
    `,
    iconSize: [32, 28],
    iconAnchor: [16, 14],
    popupAnchor: [0, -14],
  });
};

export const createSafeZoneIcon = () => {
  return L.divIcon({
    className: 'custom-safezone-marker',
    html: `
      <div style="background: #059669; border: 2px solid #ecfdf5; border-radius: 9999px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(5,150,105,0.4); color: white; font-size: 16px;">
        🛡️
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};
