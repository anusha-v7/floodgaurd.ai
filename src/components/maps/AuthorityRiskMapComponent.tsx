import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { AreaRisk, CriticalAsset, InundationZone, RiskLevel } from '../../types';
import { getRiskColor, createRiskZoneIcon, createAssetIcon } from '../../utils/mapUtils';
import { Layers, Eye, EyeOff, ShieldAlert } from 'lucide-react';

interface AuthorityRiskMapProps {
  areas: AreaRisk[];
  criticalAssets?: CriticalAsset[];
  inundationZones?: InundationZone[];
  selectedArea: AreaRisk | null;
  onSelectArea: (area: AreaRisk) => void;
  height?: string;
  showFiltersBar?: boolean;
}

export const AuthorityRiskMapComponent: React.FC<AuthorityRiskMapProps> = ({
  areas,
  criticalAssets = [],
  inundationZones = [],
  selectedArea,
  onSelectArea,
  height = '600px',
  showFiltersBar = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const zonesLayerRef = useRef<L.LayerGroup | null>(null);
  const assetsLayerRef = useRef<L.LayerGroup | null>(null);
  const inundationLayerRef = useRef<L.LayerGroup | null>(null);

  // Layer toggles
  const [showAssets, setShowAssets] = useState(true);
  const [showInundation, setShowInundation] = useState(true);
  const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [15.148, 76.924],
        zoom: 13,
        zoomControl: true,
      });

      // Dark Matter tiles for command center aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB &copy; OpenStreetMap contributors',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      inundationLayerRef.current = L.layerGroup().addTo(map);
      zonesLayerRef.current = L.layerGroup().addTo(map);
      assetsLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Inundation Layer
  useEffect(() => {
    const layer = inundationLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    if (!showInundation) return;

    inundationZones.forEach((zone) => {
      const polygon = L.polygon(zone.coordinates, {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: 0.35,
        weight: 2,
        dashArray: '4, 4',
      }).addTo(layer);

      polygon.bindTooltip(
        `<strong>${zone.areaName}</strong><br/>Inundation Depth: ${zone.depthRange} (${zone.depthValueM}m)`,
        { sticky: true, className: 'custom-leaflet-tooltip' }
      );
    });
  }, [inundationZones, showInundation]);

  // Update Critical Assets Layer
  useEffect(() => {
    const layer = assetsLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    if (!showAssets) return;

    criticalAssets.forEach((asset) => {
      if (riskFilter !== 'all' && asset.riskLevel !== riskFilter) return;

      const marker = L.marker(asset.coordinates, {
        icon: createAssetIcon(asset.type, asset.riskLevel),
      }).addTo(layer);

      marker.bindPopup(`
        <div style="font-family: system-ui; min-width: 180px; color: #0f172a; padding: 4px;">
          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; margin-bottom: 2px;">
            ${asset.type} • Elevation ${asset.elevationM}m
          </div>
          <div style="font-size: 13px; font-weight: bold; color: #0f172a; margin-bottom: 4px;">
            ${asset.name}
          </div>
          <div style="font-size: 11px; margin-bottom: 4px;">
            Risk: <strong style="color: ${getRiskColor(asset.riskLevel)};">${asset.riskLevel.toUpperCase()}</strong> | Status: <strong>${asset.status}</strong>
          </div>
          <p style="font-size: 11px; color: #475569; margin: 0; line-height: 1.3;">
            ${asset.details}
          </p>
        </div>
      `);
    });
  }, [criticalAssets, showAssets, riskFilter]);

  // Update Risk Zones Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = zonesLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    const filtered = areas.filter((a) => riskFilter === 'all' || a.riskLevel === riskFilter);

    filtered.forEach((area) => {
      const color = getRiskColor(area.riskLevel);
      const isSelected = selectedArea?.id === area.id;

      // Circle coverage
      const circle = L.circle(area.coordinates, {
        color: color,
        fillColor: color,
        fillOpacity: isSelected ? 0.5 : 0.25,
        radius: area.affectedAreaKm2 * 450,
        weight: isSelected ? 3 : 1.5,
      }).addTo(layer);

      circle.on('click', () => {
        onSelectArea(area);
      });

      // Polygon outline if present
      if (area.polygonCoords && area.polygonCoords.length > 0) {
        L.polygon(area.polygonCoords, {
          color: color,
          fillColor: color,
          fillOpacity: 0.15,
          weight: 1.5,
        }).addTo(layer);
      }

      // Marker
      const marker = L.marker(area.coordinates, {
        icon: createRiskZoneIcon(area.riskLevel, area.code.replace('ZONE-', '')),
      }).addTo(layer);

      marker.on('click', () => {
        onSelectArea(area);
      });

      if (isSelected) {
        map.panTo(area.coordinates);
      }
    });
  }, [areas, selectedArea, riskFilter, onSelectArea]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Top Filter Bar if enabled */}
      {showFiltersBar && (
        <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs z-20 relative">
          {/* Risk Level Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-mono text-[11px] uppercase mr-1">Filter Risk:</span>
            {(['all', 'critical', 'high', 'moderate', 'low'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                className={`px-2.5 py-1 rounded-lg font-mono uppercase text-[11px] transition ${
                  riskFilter === lvl
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Layer toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAssets(!showAssets)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition ${
                showAssets
                  ? 'bg-slate-800 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              {showAssets ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Assets ({criticalAssets.length})</span>
            </button>

            <button
              onClick={() => setShowInundation(!showInundation)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition ${
                showInundation
                  ? 'bg-slate-800 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              {showInundation ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Inundation Layers</span>
            </button>
          </div>
        </div>
      )}

      {/* Map Element */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-10" />

      {/* Authority Operational Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-xl text-[11px] space-y-1.5 font-mono">
        <div className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
          Command Legend
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
          <span className="text-red-400 font-semibold">Critical Zone (&gt;80% prob)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          <span className="text-orange-400">High Risk (60-80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="text-amber-400">Moderate Risk (40-60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-emerald-400">Low Risk (&lt;40%)</span>
        </div>
        <div className="pt-1 border-t border-slate-800 flex items-center gap-2 text-slate-400">
          <span>🏥 Hospital</span>
          <span>🌉 Bridge</span>
          <span>🏫 School</span>
        </div>
      </div>
    </div>
  );
};
