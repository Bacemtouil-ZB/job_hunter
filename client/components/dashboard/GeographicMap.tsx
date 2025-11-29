// client/components/dashboard/GeographicMap.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface LocationData {
  location: string;
  count: number;
}

// Coordonnées GPS réelles des villes tunisiennes
const tunisianCities: Record<string, { lat: number; lng: number; name: string }> = {
  'tunis': { lat: 36.8065, lng: 10.1815, name: 'Tunis' },
  'sfax': { lat: 34.7406, lng: 10.7603, name: 'Sfax' },
  'sousse': { lat: 35.8256, lng: 10.6361, name: 'Sousse' },
  'kairouan': { lat: 35.6781, lng: 10.0963, name: 'Kairouan' },
  'bizerte': { lat: 37.2746, lng: 9.8739, name: 'Bizerte' },
  'gabes': { lat: 33.8815, lng: 10.0982, name: 'Gabès' },
  'ariana': { lat: 36.8625, lng: 10.1956, name: 'Ariana' },
  'gafsa': { lat: 34.425, lng: 8.7842, name: 'Gafsa' },
  'monastir': { lat: 35.7775, lng: 10.8264, name: 'Monastir' },
  'ben arous': { lat: 36.7539, lng: 10.2178, name: 'Ben Arous' },
  'medenine': { lat: 33.3549, lng: 10.5055, name: 'Médenine' },
  'nabeul': { lat: 36.4561, lng: 10.7356, name: 'Nabeul' },
  'tataouine': { lat: 32.9297, lng: 10.4517, name: 'Tataouine' },
  'kasserine': { lat: 35.1676, lng: 8.8366, name: 'Kasserine' },
  'sidi bouzid': { lat: 35.0382, lng: 9.4858, name: 'Sidi Bouzid' },
  'beja': { lat: 36.7256, lng: 9.1817, name: 'Béja' },
  'jendouba': { lat: 36.5011, lng: 8.7805, name: 'Jendouba' },
  'mahdia': { lat: 35.5047, lng: 11.0622, name: 'Mahdia' },
  'siliana': { lat: 36.0853, lng: 9.3706, name: 'Siliana' },
  'manouba': { lat: 36.8081, lng: 10.0965, name: 'Manouba' }
};

export default function GeographicMap() {
  const [data, setData] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/dashboard/api/geographic-distribution');
        const result = await response.json();
        setData(result.data || []);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!mapRef.current || loading) return;

    const loadMap = async () => {
      // Add Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);
      }

      // Load Leaflet JS
      const L = await import('leaflet');

      // Remove old markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Initialize map only once
      if (!mapInstanceRef.current && mapRef.current) {
        mapInstanceRef.current = L.map(mapRef.current, {
          center: [34.0, 9.5],
          zoom: 6.5,
          zoomControl: true,
          scrollWheelZoom: true
        });

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
          maxZoom: 18
        }).addTo(mapInstanceRef.current);
      }

      // Add markers for cities with jobs
      if (mapInstanceRef.current && data.length > 0) {
        data.forEach((item) => {
          const cityName = getCityFromLocation(item.location);
          const cityData = tunisianCities[cityName];
          
          if (cityData) {
            const markerSize = 20 + (item.count * 4);
            const color = item.count > 5 ? '#ef4444' : item.count > 2 ? '#f97316' : '#3b82f6';
            
            // Create custom icon
            const customIcon = L.divIcon({
              className: 'custom-marker',
              html: `
                <div style="
                  width: ${markerSize}px;
                  height: ${markerSize}px;
                  background: ${color};
                  border: 3px solid white;
                  border-radius: 50%;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 11px;
                  cursor: pointer;
                  transition: transform 0.2s;
                "
                onmouseover="this.style.transform='scale(1.2)'"
                onmouseout="this.style.transform='scale(1)'"
                >${item.count}</div>
              `,
              iconSize: [markerSize, markerSize],
              iconAnchor: [markerSize / 2, markerSize / 2]
            });

            const marker = L.marker([cityData.lat, cityData.lng], { 
              icon: customIcon 
            }).addTo(mapInstanceRef.current);
            
            marker.bindPopup(`
              <div style="padding: 8px; min-width: 120px;">
                <div style="font-size: 15px; font-weight: bold; color: #1f2937; margin-bottom: 4px;">
                  ${cityData.name}
                </div>
                <div style="font-size: 13px; color: #6b7280;">
                  📊 ${item.count} job${item.count > 1 ? 's' : ''}
                </div>
                <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">
                  ${item.location}
                </div>
              </div>
            `, {
              className: 'custom-popup'
            });

            markersRef.current.push(marker);
          }
        });
      }
    };

    loadMap();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
    };
  }, [data, loading]);

  const getCityFromLocation = (location: string): string => {
    const parts = location.toLowerCase().split(',');
    return parts[1]?.trim() || parts[0]?.trim() || '';
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">Geographic Distribution</h3>
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-gray-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-blue-500 mx-auto mb-3"></div>
            <p className="text-xs text-gray-500">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Geographic Distribution</h3>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-medium text-gray-600">{data.length} locations</span>
        </div>
      </div>
      
      <div className="flex-1 relative rounded-lg overflow-hidden border-2 border-gray-200 shadow-md">
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/98 backdrop-blur-sm rounded-xl p-3 shadow-xl border border-gray-300 z-[1000]">
          <p className="text-xs font-bold text-gray-800 mb-2">Job Distribution</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
              <span className="text-xs text-gray-700 font-medium">1-2 jobs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-sm"></div>
              <span className="text-xs text-gray-700 font-medium">3-5 jobs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
              <span className="text-xs text-gray-700 font-medium">5+ jobs</span>
            </div>
          </div>
        </div>

        {/* Map Controls Info */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200 z-[1000]">
          <p className="text-xs text-gray-600">🖱️ Click markers for details</p>
        </div>
      </div>
    </div>
  );
}