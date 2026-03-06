import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import L from 'leaflet';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Special alert marker
const alertIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function Map({ reports = [], alerts = [], height = "400px" }) {
  // Ponta Grossa default coordinates
  const center = [-25.0916, -50.1668];

  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden', zIndex: 1 }}>
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {reports.map(report => {
          if (!report.latitude || !report.longitude) return null;
          
          const isAlert = alerts.includes(report.bairro);
          
          return (
            <Marker 
              key={report.id} 
              position={[report.latitude, report.longitude]}
              icon={isAlert ? alertIcon : new L.Icon.Default()}
            >
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <strong>{report.bairro}</strong><br/>
                  <span>Cor: {report.cor_agua}</span><br/>
                  <small>{new Date(report.data).toLocaleDateString()}</small><br/>
                  <Link to={`/denuncia/${report.id}`} style={{ display: 'block', marginTop: '5px' }}>Ver detalhes</Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
