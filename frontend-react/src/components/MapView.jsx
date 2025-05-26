import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300); // Delay agar layout sempat stabil
  }, [map]);

  return null;
}

function MapView({ umkmData = [] }) {
  return (
    <MapContainer
      center={[-0.89, 119.87]}
      zoom={13}
      style={{ height: '100%', minHeight: '300px', width: '100%' }}
      scrollWheelZoom={true}
    >
      <ResizeMap />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {umkmData.map((umkm, index) => {
        const coords = umkm.location?.coordinates;
        if (!coords || coords.length !== 2) return null;

        return (
          <Marker key={index} position={[coords[1], coords[0]]}>
            <Popup>
              <strong>{umkm.name}</strong><br />
              {umkm.description || 'Tidak ada deskripsi'}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default MapView;
