import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { INUNDATION_ZONES, KPI_SUMMARY } from '../../data/floodGuardData';
import { SimulatedBanner } from '../../components/common/SimulatedBanner';
import {
  Waves,
  Ruler,
  Clock,
  Layers,
  MapPin,
  AlertTriangle,
  Info,
  Droplets
} from 'lucide-react';

export const AuthorityInundationPage: React.FC = () => {
  const [selectedDepth, setSelectedDepth] = useState<string>('all');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [15.143, 76.920],
        zoom: 14,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB &copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
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
    const layer = layerGroupRef.current;
    if (!layer) return;
    layer.clearLayers();

    const filtered = INUNDATION_ZONES.filter(
      (z) => selectedDepth === 'all' || z.depthRange === selectedDepth
    );

    filtered.forEach((zone) => {
      const poly = L.polygon(zone.coordinates, {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: 0.45,
        weight: 3,
      }).addTo(layer);

      poly.bindPopup(`
        <div style="font-family: system-ui; min-width: 180px; color: #0f172a; padding: 4px;">
          <strong style="font-size: 13px; color: #0f172a;">${zone.areaName}</strong>
          <div style="font-size: 11px; margin: 4px 0; color: #334155;">
            Inundation Depth Tier: <strong style="color: ${zone.color};">${zone.depthRange}</strong>
          </div>
          <div style="font-size: 11px; color: #475569;">
            Max Depth: <strong>${zone.depthValueM} m</strong> • Area: <strong>${zone.affectedAreaKm2} km²</strong>
          </div>
        </div>
      `);
    });
  }, [selectedDepth]);

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              HYDROLOGICAL ACCUMULATION MODEL
            </span>
            <SimulatedBanner />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Inundation Depth & Accumulation
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Where will water accumulate? Micro-elevation digital terrain model (DEM) projection of flood pooling.
          </p>
        </div>
      </div>

      {/* 3 Main Inundation Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>AFFECTED ACCUMULATION AREA</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-4xl font-black text-white font-mono">
            {KPI_SUMMARY.impact.areaAffectedKm2} <span className="text-base text-cyan-400 font-sans">km²</span>
          </div>
          <p className="text-xs text-slate-400">Low-lying urban basin depressions</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>MAXIMUM FLOOD DEPTH</span>
            <Ruler className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-4xl font-black text-red-500 font-mono">
            {KPI_SUMMARY.impact.maxFloodDepthM} <span className="text-base text-red-400 font-sans">m</span>
          </div>
          <p className="text-xs text-slate-400">Estimated street-level crest</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>ESTIMATED TIME TO PEAK</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-4xl font-black text-amber-400 font-mono">
            {KPI_SUMMARY.impact.estimatedTimeToPeakHours} <span className="text-base text-amber-300 font-sans">Hours</span>
          </div>
          <p className="text-xs text-slate-400">Warning lead window for rescue</p>
        </div>
      </div>

      {/* Main Map with Depth Layer Filtering */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <Waves className="w-5 h-5 text-cyan-400" />
              Inundation Depth Stratification Map
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Polygonal overlay of water pooling based on surface runoff simulation
            </p>
          </div>

          {/* Depth Stratification Filter */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setSelectedDepth('all')}
              className={`px-3 py-1.5 rounded-xl transition ${
                selectedDepth === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Layers
            </button>
            <button
              onClick={() => setSelectedDepth('0–0.5 m')}
              className={`px-3 py-1.5 rounded-xl transition ${
                selectedDepth === '0–0.5 m'
                  ? 'bg-yellow-400 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              0–0.5 m
            </button>
            <button
              onClick={() => setSelectedDepth('0.5–1 m')}
              className={`px-3 py-1.5 rounded-xl transition ${
                selectedDepth === '0.5–1 m'
                  ? 'bg-orange-500 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              0.5–1 m
            </button>
            <button
              onClick={() => setSelectedDepth('>1 m')}
              className={`px-3 py-1.5 rounded-xl transition ${
                selectedDepth === '>1 m'
                  ? 'bg-red-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              &gt;1 m
            </button>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-slate-800">
          <div ref={mapContainerRef} style={{ height: '520px', width: '100%' }} />

          {/* Map Legend */}
          <div className="absolute bottom-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 text-xs font-mono space-y-2">
            <span className="text-cyan-400 font-bold uppercase text-[10px] block">
              Inundation Tiers
            </span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-red-500 border border-white/50"></span>
              <span className="text-slate-300">&gt;1 m (Critical Submersion)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-orange-500 border border-white/50"></span>
              <span className="text-slate-300">0.5–1 m (Vehicle & Ground Floor Threat)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-yellow-400 border border-white/50"></span>
              <span className="text-slate-300">0–0.5 m (Pavement Waterlogging)</span>
            </div>
          </div>
        </div>

        {/* Extensibility note */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Geospatial data currently rendered from DEM hydrologic polygons. When integrating live GIS shapefiles or GeoServer WMS tiles, update <code>INUNDATION_ZONES</code> in <code>src/data/floodGuardData.ts</code> or consume <code>GET /inundation</code> from the FastAPI backend.
          </p>
        </div>
      </div>
    </div>
  );
};
