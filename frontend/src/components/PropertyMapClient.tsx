"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

export interface PropertyMapItem {
  id: string;
  title: string;
  slug?: string;
  property_type: string;
  monthly_rent_starting: number | string;
  city: string;
  locality: string;
  address?: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  images?: Array<{ image_url?: string; is_cover?: boolean }>;
  verification_status?: string;
}

interface PropertyMapClientProps {
  properties: PropertyMapItem[];
  selectedCity: string;
  hoveredPropertyId?: string | null;
  onSelectProperty?: (property: PropertyMapItem) => void;
  height?: string;
  className?: string;
}

// City default coordinates in Gujarat and major metros
const CITY_COORDINATES: Record<string, [number, number]> = {
  "All India": [21.5000, 75.5000],
  Vadodara: [22.3072, 73.1812],
  Ahmedabad: [23.0225, 72.5714],
  Surat: [21.1702, 72.8311],
  Gandhinagar: [23.2156, 72.6369],
  Rajkot: [22.3039, 70.8022],
  Anand: [22.5645, 72.9289],
  Bharuch: [21.7051, 72.9959],
  Bengaluru: [12.9716, 77.5946],
  Pune: [18.5204, 73.8567],
  Mumbai: [19.0760, 72.8777],
  "Delhi NCR": [28.6139, 77.2090],
};

// Fallback offsets for localities within cities if lat/long are null
const LOCALITY_OFFSETS: Record<string, [number, number]> = {
  // Vadodara
  Alkapuri: [22.310695, 73.168400],
  Gotri: [22.312900, 73.149200],
  Sayajigunj: [22.316800, 73.188200],
  Fatehgunj: [22.325600, 73.189500],
  Manjalpur: [22.268900, 73.195600],
  "Vasna Road": [22.298100, 73.142500],
  Akota: [22.296500, 73.168900],
  Karelibaug: [22.327800, 73.208900],
  "Waghodia Road": [22.291200, 73.235600],
  Sevasi: [22.321000, 73.125000],
  Subhanpura: [22.322000, 73.161000],

  // Ahmedabad
  Vastrapur: [23.036500, 72.518900],
  Navrangpura: [23.038900, 72.556200],
  "SG Highway": [23.045000, 72.508000],
  "Prahlad Nagar": [23.012500, 72.508900],
  Bodakdev: [23.041000, 72.519000],
  Satellite: [23.028000, 72.525000],

  // Surat
  Vesu: [21.141200, 72.775800],
  Adajan: [21.196000, 72.795000],
  Pal: [21.189000, 72.778000],
  Piplod: [21.162000, 72.768000],
  Citylight: [21.168000, 72.792000],

  // Gandhinagar
  Infocity: [23.189500, 72.628900],
  Kudasan: [23.179000, 72.632000],
  "Gift City": [23.161000, 72.684000],
};

export default function PropertyMapClient({
  properties,
  selectedCity,
  hoveredPropertyId,
  onSelectProperty,
  height = "520px",
  className = "",
}: PropertyMapClientProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not already initialized
    if (!mapInstanceRef.current) {
      const center = CITY_COORDINATES[selectedCity] || [21.5, 75.5];
      const initialZoom = selectedCity === "All India" ? 6 : 13;
      const map = L.map(mapContainerRef.current, {
        center,
        zoom: initialZoom,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      // OpenStreetMap standard clean tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center when selectedCity changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const center = CITY_COORDINATES[selectedCity] || [21.5, 75.5];
    const zoomLevel = selectedCity === "All India" ? 6 : 13;
    mapInstanceRef.current.setView(center, zoomLevel, { animate: true });
  }, [selectedCity]);

  // Render markers for properties
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const bounds = L.latLngBounds([]);
    let validMarkersCount = 0;

    properties.forEach((property, index) => {
      let lat = Number(property.latitude);
      let lng = Number(property.longitude);

      // If lat/lng missing, lookup locality or generate slight jitter around city center
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        if (property.locality && LOCALITY_OFFSETS[property.locality]) {
          [lat, lng] = LOCALITY_OFFSETS[property.locality];
        } else {
          const baseCity = CITY_COORDINATES[property.city] || CITY_COORDINATES[selectedCity] || [22.3072, 73.1812];
          const angle = (index * 45 * Math.PI) / 180;
          const radius = 0.015 + (index % 3) * 0.008;
          lat = baseCity[0] + Math.sin(angle) * radius;
          lng = baseCity[1] + Math.cos(angle) * radius;
        }
      }

      const rentFormatted = Number(property.monthly_rent_starting || 0).toLocaleString("en-IN");
      const coverImg =
        property.images?.find((i) => i.is_cover)?.image_url ||
        property.images?.[0]?.image_url ||
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80";

      // Custom HTML Marker with Price Tag
      const customIcon = L.divIcon({
        className: `custom-property-map-pin pin-${property.id}`,
        html: `
          <div id="map-pin-${property.id}" style="
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: #059669;
            color: #ffffff;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 11px;
            font-weight: 800;
            padding: 4px 8px;
            border-radius: 9999px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            border: 2px solid #ffffff;
            cursor: pointer;
            white-space: nowrap;
            transition: transform 0.15s ease-out, background-color 0.15s ease-out;
            position: relative;
          ">
            <svg style="width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 2.2;" viewBox="0 0 24 24">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            <span>₹${rentFormatted}</span>
          </div>
        `,
        iconSize: [80, 30],
        iconAnchor: [40, 15],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Popup Content Card
      const popupHtml = `
        <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 210px; max-width: 240px; padding: 2px;">
          <div style="position: relative; border-radius: 12px; overflow: hidden; margin-bottom: 8px; height: 120px; background: #f1f5f9;">
            <img src="${coverImg}" alt="${property.title}" loading="lazy" decoding="async" style="width: 100%; height: 100%; object-fit: cover;" />
            <span style="position: absolute; top: 6px; left: 6px; background: rgba(15,23,42,0.85); color: #fff; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
              ${(property.property_type || "PG").replace("_", " ")}
            </span>
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 800; color: #0f172a; line-height: 1.3;">
            ${property.title}
          </h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b; display: flex; align-items: center; gap: 3px;">
            📍 ${property.locality}, ${property.city}
          </p>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px; margin-top: 4px;">
            <span style="font-size: 13px; font-weight: 900; color: #059669;">
              ₹${rentFormatted}<span style="font-size: 10px; font-weight: 500; color: #64748b;">/mo</span>
            </span>
            <a href="/properties/${property.slug || property.id}" style="font-size: 11px; font-weight: 700; background: #0071e3; color: #ffffff; padding: 3px 8px; border-radius: 6px; text-decoration: none;">
              Details →
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        offset: [0, -10],
      });

      marker.on("click", () => {
        if (onSelectProperty) onSelectProperty(property);
      });

      markersRef.current[property.id] = marker;
      bounds.extend([lat, lng]);
      validMarkersCount++;
    });

    if (validMarkersCount > 0 && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [properties, selectedCity]);

  // Ultra-fast lightweight hover highlight without re-creating Leaflet markers
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([propId, marker]) => {
      const el = document.getElementById(`map-pin-${propId}`);
      if (!el) return;
      if (hoveredPropertyId === propId) {
        el.style.backgroundColor = "#0f172a";
        el.style.transform = "scale(1.22)";
        marker.setZIndexOffset(1000);
      } else {
        el.style.backgroundColor = "#059669";
        el.style.transform = "scale(1)";
        marker.setZIndexOffset(0);
      }
    });
  }, [hoveredPropertyId]);

  return (
    <div className={`relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 ${className}`} style={{ height }}>
      {/* Map Target Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating City & Property Counter Overlay */}
      <div className="absolute top-3 left-3 z-[400] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-md border border-slate-200/80 flex items-center gap-2 text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="font-bold text-slate-800 dark:text-white">{selectedCity} Interactive Map</span>
        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
          {properties.length} Active Pins
        </span>
      </div>

      {/* Recenter Button */}
      <button
        type="button"
        onClick={() => {
          if (!mapInstanceRef.current) return;
          const center = CITY_COORDINATES[selectedCity] || [22.3072, 73.1812];
          mapInstanceRef.current.setView(center, 13, { animate: true });
        }}
        className="absolute bottom-4 right-4 z-[400] bg-white text-slate-800 hover:text-[#0071e3] p-2.5 rounded-xl shadow-lg border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition hover:shadow-xl cursor-pointer"
        title="Reset Map to City Center"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
        </svg>
        <span>Recenter {selectedCity}</span>
      </button>
    </div>
  );
}
