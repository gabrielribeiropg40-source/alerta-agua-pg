import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function AdminMap({ reports }) {
  const center = [-25.0916, -50.1668]; // Ponta Grossa

  return (
    <div className="card shadow-md" style={{ padding: 0, overflow: 'hidden', height: '500px' }}>
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {reports.map((report) => {
          if (!report.latitude || !report.longitude) return null;
          return (
            <Marker key={report.id} position={[report.latitude, report.longitude]}>
              <Popup>
                <div style={{ maxWidth: '200px' }}>
                  {report.foto_url && (
                      <img src={report.foto_url} alt="Denúncia" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} />
                  )}
                  <strong>{report.bairro}</strong><br/>
                  <span style={{ fontSize: '0.85rem' }}>{report.cor_agua} - {report.cheiro}</span><br/>
                  <p style={{ fontSize: '0.85rem', margin: '4px 0', fontStyle: 'italic' }}>"{report.descricao}"</p>
                  <small style={{ color: '#666' }}>{new Date(report.data).toLocaleString('pt-BR')}</small>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
