import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { SAFE_ZONES } from '../../data/floodGuardData';
import { SafeZone } from '../../types';
import { createSafeZoneIcon } from '../../utils/mapUtils';
import {
  ShieldCheck,
  MapPin,
  Users,
  PhoneCall,
  Navigation,
  Mountain,
  Building,
  CheckCircle2,
  Info
} from 'lucide-react';
import { SimulatedBanner } from '../../components/common/SimulatedBanner';

export const PublicSafeZonesPage: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<SafeZone>(SAFE_ZONES[0]);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [15.155, 76.920],
        zoom: 13,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
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

    SAFE_ZONES.forEach((zone) => {
      const marker = L.marker(zone.coordinates, {
        icon: createSafeZoneIcon(),
      }).addTo(group);

      marker.bindPopup(`
        <div style="font-family: system-ui; min-width: 180px; padding: 4px;">
          <strong style="color: #065f46; font-size: 13px;">${zone.name}</strong>
          <div style="font-size: 11px; color: #475569; margin: 4px 0;">${zone.type} • Elev: ${zone.elevationM}m</div>
          <p style="font-size: 11px; margin: 0; color: #334155;">Capacity: ${zone.currentOccupancy}/${zone.capacity}</p>
        </div>
      `);

      marker.on('click', () => {
        setSelectedZone(zone);
      });
    });

    if (selectedZone) {
      map.panTo(selectedZone.coordinates);
    }
  }, [selectedZone]);

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 font-bold">
            EMERGENCY EVACUATION LOCATIONS
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Designated Safe Zones & Shelters
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Pre-identified higher ground and relief shelters stocked with clean water, medicine, and food rations.
          </p>
        </div>

        <SimulatedBanner
          label="DEMO LOCATIONS"
          subtext="Simulated Bellary relief shelter data for demonstration"
        />
      </div>

      {/* Map and Safe Zones List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Safe Zones Cards */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            Available Centers ({SAFE_ZONES.length})
          </h3>

          <div className="space-y-3">
            {SAFE_ZONES.map((zone) => {
              const isSelected = selectedZone.id === zone.id;
              const occupancyPercent = Math.round((zone.currentOccupancy / zone.capacity) * 100);

              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`p-5 rounded-3xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {zone.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600 flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                      {zone.distanceKm} km away
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug">{zone.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {zone.location}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Elevation</span>
                      <span className="font-mono font-semibold text-slate-800">{zone.elevationM} m (High)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Occupancy</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {zone.currentOccupancy} / {zone.capacity} ({occupancyPercent}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map & Detail Container */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            <div ref={mapContainerRef} style={{ height: '420px', width: '100%' }} />

            {/* Selected Zone Focus Box */}
            <div className="p-6 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">
                  SELECTED SHELTER
                </span>
                <h4 className="text-lg font-bold text-slate-900">{selectedZone.name}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                  Direct Helpline: <span className="font-mono font-semibold text-slate-800">{selectedZone.contact}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Medical & Food Supplies Active
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Always follow instructions from police and SDRF officers on ground while moving along evacuation corridors. Do not walk or drive through flowing water.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
