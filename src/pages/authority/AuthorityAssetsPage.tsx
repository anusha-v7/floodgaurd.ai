import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { CRITICAL_ASSETS } from '../../data/floodGuardData';
import { CriticalAsset, AssetType, RiskLevel } from '../../types';
import { createAssetIcon, getRiskColor } from '../../utils/mapUtils';
import { RiskBadge } from '../../components/common/RiskBadge';
import { SimulatedBanner } from '../../components/common/SimulatedBanner';
import {
  Building2,
  Filter,
  Layers,
  MapPin,
  AlertTriangle,
  HeartPulse,
  Flame,
  Shield,
  GraduationCap,
  Car
} from 'lucide-react';

export const AuthorityAssetsPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'all' | AssetType>('all');
  const [selectedRisk, setSelectedRisk] = useState<'all' | RiskLevel>('all');
  const [activeAsset, setActiveAsset] = useState<CriticalAsset | null>(CRITICAL_ASSETS[0]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const filteredAssets = CRITICAL_ASSETS.filter((asset) => {
    const matchesType = selectedType === 'all' || asset.type === selectedType;
    const matchesRisk = selectedRisk === 'all' || asset.riskLevel === selectedRisk;
    return matchesType && matchesRisk;
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [15.150, 76.924],
        zoom: 13,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB &copy; OpenStreetMap contributors',
        maxZoom: 19,
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

  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersRef.current;
    if (!map || !group) return;

    group.clearLayers();

    filteredAssets.forEach((asset) => {
      const marker = L.marker(asset.coordinates, {
        icon: createAssetIcon(asset.type, asset.riskLevel),
      }).addTo(group);

      marker.bindPopup(`
        <div style="font-family: system-ui; min-width: 180px; color: #0f172a; padding: 4px;">
          <strong style="font-size: 13px;">${asset.name}</strong>
          <div style="font-size: 11px; margin: 4px 0;">
            Type: <strong>${asset.type.toUpperCase()}</strong> | Risk: <strong style="color: ${getRiskColor(asset.riskLevel)};">${asset.riskLevel.toUpperCase()}</strong>
          </div>
          <p style="font-size: 11px; color: #475569; margin: 0;">${asset.details}</p>
        </div>
      `);

      marker.on('click', () => {
        setActiveAsset(asset);
      });
    });

    if (activeAsset) {
      map.panTo(activeAsset.coordinates);
    }
  }, [filteredAssets, activeAsset]);

  const assetTypes: { type: 'all' | AssetType; label: string }[] = [
    { type: 'all', label: 'All Types' },
    { type: 'hospital', label: 'Hospitals' },
    { type: 'bridge', label: 'Bridges' },
    { type: 'school', label: 'Schools' },
    { type: 'police', label: 'Police Stations' },
    { type: 'fire', label: 'Fire & Rescue' },
    { type: 'road', label: 'Roadways' },
    { type: 'shelter', label: 'Shelters' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              LIFELINE INFRASTRUCTURE MONITORING
            </span>
            <SimulatedBanner />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Critical Assets at Flood Risk
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Geospatial tracking of medical centers, arterial bridges, schools, and rescue staging hubs.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
          {assetTypes.map((item) => (
            <button
              key={item.type}
              onClick={() => setSelectedType(item.type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition ${
                selectedType === item.type
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Risk Level Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-mono text-xs uppercase">Risk:</span>
          {(['all', 'critical', 'high', 'moderate', 'low'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedRisk(lvl)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono uppercase transition ${
                selectedRisk === lvl
                  ? 'bg-slate-200 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Map and Assets Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div ref={mapContainerRef} style={{ height: '600px', width: '100%' }} />
        </div>

        {/* "Assets at Risk" Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Assets at Risk ({filteredAssets.length})</span>
              </h3>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredAssets.map((asset) => {
                const isSelected = activeAsset?.id === asset.id;
                return (
                  <div
                    key={asset.id}
                    onClick={() => setActiveAsset(asset)}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500/60 shadow-md ring-1 ring-cyan-500/30'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {asset.type} • Elev {asset.elevationM}m
                      </span>
                      <RiskBadge level={asset.riskLevel} size="sm" />
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">{asset.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      {asset.location} ({asset.areaName})
                    </p>

                    <p className="text-xs text-slate-300 mt-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800/80 leading-relaxed">
                      {asset.details}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Status: <strong className="text-white uppercase">{asset.status}</strong></span>
                      <span className="text-cyan-400 hover:underline">Focus on Map →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
