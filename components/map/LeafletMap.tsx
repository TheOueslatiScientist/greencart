"use client";

import { haversineDistance } from "@/lib/geo";
import type { ProducerMarker } from "@/types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate, Navigation } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// ── Fix Leaflet default icon URLs (broken in webpack/Next.js) ────────────────
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Custom icons ──────────────────────────────────────────────────────────────
const producerIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:36px;height:36px;
    background:#2E7D32;
    border:3px solid #fff;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    box-shadow:0 2px 8px rgba(0,0,0,0.25);
  "></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -38],
});

const userIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:18px;height:18px;
    background:#1565C0;
    border:3px solid #fff;
    border-radius:50%;
    box-shadow:0 0 0 6px rgba(21,101,192,0.2);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// ── Badges styling ─────────────────────────────────────────────────────────────
const BADGE_STYLE: Record<string, string> = {
  bio: "background:#dcfce7;color:#15803d",
  local: "background:#dbeafe;color:#1d4ed8",
  antigaspi: "background:#ffedd5;color:#c2410c",
  saison: "background:#fef9c3;color:#a16207",
  promo: "background:#fee2e2;color:#dc2626",
};
const BADGE_LABEL: Record<string, string> = {
  bio: "🌿 Bio",
  local: "📍 Local",
  antigaspi: "♻️ Anti-gaspi",
  saison: "🌱 Saison",
  promo: "🏷️ Promo",
};

// ── Component ─────────────────────────────────────────────────────────────────
interface LeafletMapProps {
  producers: ProducerMarker[];
}

export default function LeafletMap({ producers }: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");
  const [sortedProducers, setSortedProducers] = useState<(ProducerMarker & { distanceFromUser?: number })[]>(producers);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // ── Init map ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: [50.65, 3.10], // Centre MEL — Lille
      zoom: 11,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    // Add producer markers
    producers.forEach((p) => {
      const marker = L.marker([p.latitude, p.longitude], { icon: producerIcon }).addTo(map);

      const badgesHtml = p.badges
        .slice(0, 3)
        .map(
          (b) =>
            `<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:600;${BADGE_STYLE[b] ?? ""}">${BADGE_LABEL[b] ?? b}</span>`
        )
        .join("");

      const stars = Array.from({ length: 5 })
        .map((_, i) => `<span style="color:${i < Math.round(p.rating) ? "#FFB74D" : "#e5e7eb"}">★</span>`)
        .join("");

      marker.bindPopup(
        `<div style="min-width:200px;font-family:Inter,sans-serif;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <img src="${p.avatar}" style="width:40px;height:40px;border-radius:12px;object-fit:cover;" />
            <div>
              <p style="font-weight:700;font-size:14px;margin:0;color:#111">${p.name}</p>
              <p style="font-size:11px;color:#6b7280;margin:0;">📍 ${p.city}</p>
            </div>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;">${badgesHtml}</div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <div style="font-size:12px;">${stars} <span style="color:#374151;font-weight:600;">${p.rating.toFixed(1)}</span></div>
            <span style="font-size:11px;color:#6b7280;">${p.productCount} produits</span>
          </div>
          <a href="/producteurs/${p.slug}"
            style="display:block;text-align:center;background:#2E7D32;color:#fff;padding:7px 0;border-radius:10px;font-size:13px;font-weight:600;text-decoration:none;">
            Voir la fiche →
          </a>
        </div>`,
        { maxWidth: 260, className: "greencart-popup" }
      );

      marker.on("click", () => setSelectedId(p.id));
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Géolocalisation ────────────────────────────────────────────────────────
  const locateUser = () => {
    if (!navigator.geolocation) {
      setLocError("La géolocalisation n'est pas disponible sur ce navigateur.");
      return;
    }
    setLocating(true);
    setLocError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocating(false);
        setUserPos({ lat: latitude, lng: longitude });

        if (mapRef.current) {
          // Remove previous user marker
          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
          }
          const m = L.marker([latitude, longitude], { icon: userIcon })
            .addTo(mapRef.current)
            .bindPopup("<b>📍 Vous êtes ici</b>")
            .openPopup();
          userMarkerRef.current = m;

          mapRef.current.setView([latitude, longitude], 11, { animate: true });
        }

        // Sort producers by distance
        const withDist = producers
          .map((p) => ({
            ...p,
            distanceFromUser: haversineDistance(latitude, longitude, p.latitude, p.longitude),
          }))
          .sort((a, b) => a.distanceFromUser - b.distanceFromUser);
        setSortedProducers(withDist);
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocError("Permission refusée. Autorisez la géolocalisation dans votre navigateur.");
        } else {
          setLocError("Impossible de récupérer votre position.");
        }
      },
      { timeout: 10000 }
    );
  };

  // ── Fly to producer on sidebar click ──────────────────────────────────────
  const flyToProducer = (p: ProducerMarker) => {
    if (mapRef.current) {
      mapRef.current.setView([p.latitude, p.longitude], 13, { animate: true });
      setSelectedId(p.id);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-0 h-[calc(100vh-64px)]">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="w-full lg:w-80 xl:w-96 bg-white border-r border-brand-gray flex flex-col shrink-0 h-64 lg:h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-brand-gray">
          <h2 className="font-display font-bold text-gray-900 text-base">
            {sortedProducers.length} producteurs
          </h2>
          {userPos && (
            <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
              <Navigation size={11} /> Triés par distance
            </p>
          )}

          <button
            onClick={locateUser}
            disabled={locating}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            <Locate size={15} />
            {locating ? "Localisation…" : userPos ? "Recentrer sur moi" : "Me localiser"}
          </button>

          {locError && (
            <p className="mt-2 text-xs text-brand-red">{locError}</p>
          )}
        </div>

        {/* Producer list */}
        <div className="flex-1 overflow-y-auto divide-y divide-brand-gray">
          {sortedProducers.map((p) => (
            <button
              key={p.id}
              onClick={() => flyToProducer(p)}
              className={`w-full text-left p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors group ${
                selectedId === p.id ? "bg-green-50 border-l-2 border-brand-primary" : ""
              }`}
            >
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 leading-tight truncate group-hover:text-brand-primary transition-colors">
                  {p.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">📍 {p.city}</p>
                {p.distanceFromUser !== undefined && (
                  <p className="text-xs text-brand-primary font-medium mt-0.5">
                    {p.distanceFromUser < 1
                      ? `${(p.distanceFromUser * 1000).toFixed(0)} m`
                      : `${p.distanceFromUser.toFixed(1)} km`}
                  </p>
                )}
              </div>
              <div className="text-xs text-gray-400 shrink-0 text-right">
                <div className="text-brand-orange font-medium">★ {p.rating.toFixed(1)}</div>
                <div className="mt-0.5">{p.productCount} produits</div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* ── Map ─────────────────────────────────────────────────────── */}
      <div className="flex-1 relative">
        <div ref={containerRef} className="w-full h-full" />

        {/* Legend overlay */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-xl shadow-card p-3 text-xs space-y-1.5 border border-brand-gray">
          <p className="font-semibold text-gray-700 mb-2">Légende</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-brand-primary" />
            <span className="text-gray-600">Producteur GreenCart</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-gray-600">Votre position</span>
          </div>
        </div>
      </div>

      {/* ── Global popup CSS ─────────────────────────────────────────── */}
      <style>{`
        .greencart-popup .leaflet-popup-content-wrapper {
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          padding: 4px;
        }
        .greencart-popup .leaflet-popup-tip {
          background: white;
        }
        .greencart-popup .leaflet-popup-content {
          margin: 12px 14px;
        }
      `}</style>
    </div>
  );
}
