import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { AreaRisk } from '../../types';
import { getRiskColor, createRiskZoneIcon } from '../../utils/mapUtils';

interface PublicRiskMapProps {
  areas: AreaRisk[];
  selectedArea: AreaRisk | null;
  onSelectArea: (area: AreaRisk) => void;
  height?: string;
}

export const PublicRiskMapComponent: React.FC<PublicRiskMapProps> = ({
  areas,
  selectedArea,
  onSelectArea,
  height = '500px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [15.145, 76.925],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      markersRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when areas or selectedArea changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = markersRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    areas.forEach((area) => {
      const color = getRiskColor(area.riskLevel);
      const isSelected = selectedArea?.id === area.id;

      // Add circle area overlay
      const circle = L.circle(area.coordinates, {
        color: color,
        fillColor: color,
        fillOpacity: isSelected ? 0.45 : 0.25,
        radius: area.affectedAreaKm2 * 450,
        weight: isSelected ? 3 : 1.5,
      }).addTo(layerGroup);

      circle.on('click', () => {
        onSelectArea(area);
      });

      // Add custom marker icon
      const marker = L.marker(area.coordinates, {
        icon: createRiskZoneIcon(area.riskLevel, area.code.replace('ZONE-', '')),
      }).addTo(layerGroup);

      // Safe public popup without raw model internals
      const popupContent = `
        <div style="font-family: system-ui, sans-serif; min-width: 200px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <strong style="font-size: 13px; color: #0f172a;">${area.name}</strong>
          </div>
          <div style="margin-bottom: 6px;">
            <span style="display: inline-block; padding: 2px 6px; border-radius: 9999px; font-size: 11px; font-weight: bold; background-color: ${color}20; color: ${color}; border: 1px solid ${color}40;">
              ${area.riskLevel.toUpperCase()} RISK
            </span>
          </div>
          <p style="font-size: 12px; color: #334155; margin: 4px 0;"><strong>Rainfall:</strong> ${area.rainfallMmHr} mm/hr</p>
          <p style="font-size: 12px; color: #334155; margin: 4px 0;"><strong>Flood Probability:</strong> ${area.floodProbability}%</p>
          <p style="font-size: 11px; color: #64748b; margin-top: 6px; border-top: 1px solid #e2e8f0; padding-top: 4px; line-height: 1.3;">
            ⚠️ ${area.recommendedAction}
          </p>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        onSelectArea(area);
      });

      if (isSelected) {
        marker.openPopup();
      }
    });

    if (selectedArea) {
      map.panTo(selectedArea.coordinates);
    }
  }, [areas, selectedArea, onSelectArea]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-md border border-slate-200">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-10" />

      {/* Public Legend */}
      <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 text-xs space-y-1.5">
        <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
          Public Risk Levels
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white shadow-xs"></span>
          <span className="text-slate-700">Green = Low Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shadow-xs"></span>
          <span className="text-slate-700">Yellow = Moderate Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500 border border-white shadow-xs"></span>
          <span className="text-slate-700">Orange = High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600 border border-white shadow-xs animate-pulse"></span>
          <span className="text-slate-700 font-semibold">Red = Critical Risk</span>
        </div>
      </div>
    </div>
  );
};
