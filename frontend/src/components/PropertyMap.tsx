"use client";

import dynamic from "next/dynamic";
import React from "react";
import type { PropertyMapItem } from "./PropertyMapClient";

// Dynamically import Leaflet Map with SSR disabled
const PropertyMapClient = dynamic(() => import("./PropertyMapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] bg-slate-100 rounded-3xl border border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-3 animate-pulse">
      <div className="w-10 h-10 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin" />
      <span className="text-xs font-bold text-slate-500">Loading Interactive Gujarat Property Map...</span>
    </div>
  ),
});

interface PropertyMapProps {
  properties: PropertyMapItem[];
  selectedCity: string;
  hoveredPropertyId?: string | null;
  onSelectProperty?: (property: PropertyMapItem) => void;
  height?: string;
  className?: string;
}

export default function PropertyMap(props: PropertyMapProps) {
  return <PropertyMapClient {...props} />;
}
