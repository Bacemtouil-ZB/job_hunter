// client/components/dashboard/GeographicMap.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MapPin, Map } from 'lucide-react';
import type { Map as LeafletMap, Marker } from 'leaflet';

/**
 * Interface pour les données de localisation
 */
interface LocationData {
  location: string;
  count: number;
}

/**
 * Interface pour les données des villes
 */
interface CityData {
  lat: number;
  lng: number;
  name: string;
}

/**
 * Coordonnées GPS des villes tunisiennes
 * Centralisées pour une meilleure maintenance
 */
const TUNISIAN_CITIES: Record<string, CityData> = {
  tunis: { lat: 36.8065, lng: 10.1815, name: 'Tunis' },
  sfax: { lat: 34.7406, lng: 10.7603, name: 'Sfax' },
  sousse: { lat: 35.8256, lng: 10.6361, name: 'Sousse' },
  kairouan: { lat: 35.6781, lng: 10.0963, name: 'Kairouan' },
  bizerte: { lat: 37.2746, lng: 9.8739, name: 'Bizerte' },
  gabes: { lat: 33.8815, lng: 10.0982, name: 'Gabès' },
  ariana: { lat: 36.8625, lng: 10.1956, name: 'Ariana' },
  gafsa: { lat: 34.425, lng: 8.7842, name: 'Gafsa' },
  monastir: { lat: 35.7775, lng: 10.8264, name: 'Monastir' },
  'ben arous': { lat: 36.7539, lng: 10.2178, name: 'Ben Arous' },
  medenine: { lat: 33.3549, lng: 10.5055, name: 'Médenine' },
  nabeul: { lat: 36.4561, lng: 10.7356, name: 'Nabeul' },
  kasserine: { lat: 35.1676, lng: 8.8366, name: 'Kasserine' },
  mahdia: { lat: 35.5047, lng: 11.0622, name: 'Mahdia' },
  manouba: { lat: 36.8081, lng: 10.0965, name: 'Manouba' },
};

/**
 * Configuration de la carte
 */
const MAP_CONFIG = {
  center: [34.0, 9.5] as [number, number],
  zoom: 6.5,
  tileUrl: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  attribution: '© OpenStreetMap, © CARTO',
  maxZoom: 19,
} as const;

/**
 * Configuration des marqueurs
 */
const MARKER_CONFIG = {
  baseSize: 18,
  sizeMultiplier: 3,
  colors: {
    low: '#3b82f6',    // Blue
    medium: '#f97316', // Orange
    high: '#ef4444',   // Red
  },
} as const;

/**
 * Retourne la couleur du marqueur selon le nombre de jobs
 */
const getMarkerColor = (count: number): string => {
  if (count > 5) return MARKER_CONFIG.colors.high;
  if (count > 2) return MARKER_CONFIG.colors.medium;
  return MARKER_CONFIG.colors.low;
};

/**
 * Extrait le nom de la ville depuis la location
 */
const getCityKey = (location: string): string => {
  const parts = location.toLowerCase().split(',');
  return parts[1]?.trim() || parts[0]?.trim() || '';
};

/**
 * Charge dynamiquement le CSS de Leaflet
 */
const loadLeafletCSS = (): void => {
  if (!document.getElementById('leaflet-css')) {
    const link = document.createElement('link');
    link.id = 'leaflet-css';
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
    document.head.appendChild(link);
  }
};

/**
 * Composant principal de la carte géographique
 * Affiche la distribution des jobs par ville en Tunisie
 */
export default function GeographicMap() {
  const [data, setData] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Marker[]>([]);

  /**
   * Effet: Chargement des données depuis l'API
   */
  useEffect(() => {
    fetch('/dashboard/api/geographic-distribution')
      .then((res) => res.json())
      .then((result) => setData(result.data || []))
      .catch((err) => console.error('Error loading geographic data:', err))
      .finally(() => setLoading(false));
  }, []);

  /**
   * Effet: Initialisation de la carte Leaflet
   */
  useEffect(() => {
    // Vérifications préalables
    if (!mapRef.current || loading || data.length === 0) return;

    const initMap = async () => {
      try {
        // Chargement des assets
        loadLeafletCSS();
        const L = await import('leaflet');

        // Création de la carte
        const map = L.map(mapRef.current!, {
          center: MAP_CONFIG.center,
          zoom: MAP_CONFIG.zoom,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        // Ajout de la couche de tuiles
        L.tileLayer(MAP_CONFIG.tileUrl, {
          attribution: MAP_CONFIG.attribution,
          maxZoom: MAP_CONFIG.maxZoom,
        }).addTo(map);

        // Création des marqueurs pour chaque ville
        const markers: Marker[] = [];

        data.forEach((item) => {
          const cityKey = getCityKey(item.location);
          const city = TUNISIAN_CITIES[cityKey];
          
          if (!city) return;

          const color = getMarkerColor(item.count);
          const size = MARKER_CONFIG.baseSize + item.count * MARKER_CONFIG.sizeMultiplier;

          // Création de l'icône personnalisée
          const icon = L.divIcon({
            className: 'custom-marker',
            html: `
              <div style="
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 4px 15px rgba(0,0,0,0.25);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 700;
                font-size: 11px;
                cursor: pointer;
                transition: transform 0.3s ease;
              "
              onmouseover="this.style.transform='scale(1.3)'"
              onmouseout="this.style.transform='scale(1)'"
              >${item.count}</div>
            `,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          });

          // Création du marqueur avec popup
          const marker = L.marker([city.lat, city.lng], { icon }).bindPopup(
            `
            <div style="padding: 12px; font-family: system-ui, sans-serif;">
              <div style="font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 8px;">
                ${city.name}
              </div>
              <div style="background: #f3f4f6; padding: 8px; border-radius: 8px;">
                <div style="font-size: 24px; font-weight: 800; color: ${color};">
                  ${item.count}
                </div>
                <div style="font-size: 11px; color: #6b7280; text-transform: uppercase;">
                  Job${item.count > 1 ? 's' : ''} disponible${item.count > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            `,
            { maxWidth: 200 }
          );

          marker.addTo(map);
          markers.push(marker);
        });

        // Sauvegarde des références
        mapInstanceRef.current = map;
        markersRef.current = markers;
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();

    /**
     * Cleanup: Nettoyage de la carte et des marqueurs
     */
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data, loading]);

  /**
   * Rendu: État de chargement
   */
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-3" />
          <p className="text-xs font-medium text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  /**
   * Rendu: Carte interactive
   */
  return (
    <div className="h-full flex flex-col">
      {/* En-tête avec titre et compteur */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-800">Geographic Distribution</h3>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
          <MapPin className="w-3 h-3 text-blue-600" />
          <span className="text-xs font-bold text-blue-700">{data.length}</span>
        </div>
      </div>

      {/* Conteneur de la carte */}
      <div className="flex-1 relative rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
        <div ref={mapRef} className="w-full h-full" />

        {/* Légende */}
        <div className="absolute bottom-2 right-2 bg-white/98 backdrop-blur-md rounded-lg p-2 shadow-xl border border-gray-200 z-[1000]">
          <div className="text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full block" />
            Jobs
          </div>
          <div className="space-y-1">
            {[
              { color: 'bg-blue-500', label: '1-2' },
              { color: 'bg-orange-500', label: '3-5' },
              { color: 'bg-red-500', label: '5+' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <div className={`w-4 h-4 rounded-full ${item.color} border-2 border-white shadow-sm`} />
                <span className="text-xs text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}