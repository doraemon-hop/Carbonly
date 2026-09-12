import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export const LeafletMap = ({ locations, selectedLocation, onSelectLocation }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center on Ahmedabad (default)
    const initialCenter = [23.0372, 72.5528];

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 13,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap standard tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Helper to get pin color
    const getPinColor = (categoryKey) => {
      switch (categoryKey) {
        case 'ewaste': return '#0284c7'; // sky
        case 'repair': return '#d97706'; // amber
        case 'clothing': return '#0d9488'; // teal
        case 'plastic': return '#059669'; // emerald
        default: return '#10b981';
      }
    };

    // Add markers for locations
    locations.forEach((loc) => {
      const pinColor = getPinColor(loc.categoryKey);
      const isSelected = selectedLocation?.id === loc.id;

      // Custom SVG div icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div style="
            background-color: ${pinColor};
            width: ${isSelected ? '36px' : '30px'};
            height: ${isSelected ? '36px' : '30px'};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background-color: white;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: isSelected ? [36, 36] : [30, 30],
        iconAnchor: isSelected ? [18, 36] : [15, 30],
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map);

      // Popup
      marker.bindPopup(`
        <div style="font-family: system-ui; padding: 4px; min-width: 180px;">
          <div style="font-size: 10px; font-weight: 700; color: ${pinColor}; text-transform: uppercase;">
            ${loc.category}
          </div>
          <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin-top: 2px;">
            ${loc.name}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            ${loc.address}
          </div>
          <div style="margin-top: 6px; display: flex; align-items: center; justify-content: space-between; font-size: 11px;">
            <span style="font-weight: 600; color: #059669;">⭐ ${loc.rating} (${loc.reviewsCount})</span>
            <span style="color: #64748b; font-weight: 500;">${loc.distance}</span>
          </div>
        </div>
      `);

      marker.on('click', () => {
        if (onSelectLocation) {
          onSelectLocation(loc);
        }
      });

      markersRef.current[loc.id] = marker;
    });

    // If selected location exists, pan to it
    if (selectedLocation && markersRef.current[selectedLocation.id]) {
      map.flyTo([selectedLocation.lat, selectedLocation.lng], 15, { duration: 1.2 });
      markersRef.current[selectedLocation.id].openPopup();
    }
  }, [locations, selectedLocation]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px]" />
    </div>
  );
};
