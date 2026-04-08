"use client";

import type { ProducerMarker } from "@/types";
import dynamic from "next/dynamic";

// Import Leaflet SANS SSR (Leaflet utilise window/document)
const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Chargement de la carte…</p>
      </div>
    </div>
  ),
});

export function MapWrapper({ producers }: { producers: ProducerMarker[] }) {
  return <LeafletMap producers={producers} />;
}
