import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Map from '../components/Map';
import ReportCard from '../components/ReportCard';
import SEO from '../components/SEO';
import { dbReports } from '../services/db';
import { checkRegionalAlerts, getTop10Neighborhoods, getTopWaterShortageNeighborhoods } from '../services/analysis';
import { AlertTriangle, TrendingUp, AlertCircle } from 'lucide-react';

export default function Home() {
  const [reports, setReports] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [shortageRankings, setShortageRankings] = useState([]);

  useEffect(() => {
    // Load data from mock DB
    const allReports = dbReports.getAll();
    // Sort by newest
    allReports.sort((a, b) => new Date(b.data) - new Date(a.data));
    setReports(allReports);
    
    // Check Analysis
    setAlerts(checkRegionalAlerts());
    setRankings(getTop10Neighborhoods());
    setShortageRankings(getTopWaterShortageNeighborhoods());
  }, []);

  return (
    <div className="page-container">
      <SEO 
        title="InÃ­cio" 
        description="Portal cidadÃ£o para monitoramento de Ã¡gua. Veja denÃºncias recentes e ajude a mapear a qualidade da Ã¡gua em Ponta Grossa." 
      />
      
      <section className="hero">
        <h1>Alerta Ãgua PG</h1>
        <p>Ajude a monitorar a qualidade da Ã¡gua em Ponta Grossa</p>
        
        <div className="hero-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
           <Link to="/denuncia/nova" className="btn btn-primary btn-large">
              Registrar problema de qualidade
           </Link>
           <Link to="/falta-agua/nova" className="btn btn-secondary btn-large" style={{ backgroundColor: '#ea580c', color: 'white', border: 'none' }}>
              Registrar falta de Ã¡gua
           </Link>
        </div>
      </section>

      {alerts.length > 0 && (
        <div className="alert-banner">
          <AlertTriangle size={24} />
          <div>
            <strong>ALERTA:</strong> ConcentraÃ§Ã£o de problemas detectada nas Ãºltimas horas em: 
            {' ' + alerts.join(', ')}.
          </div>
        </div>
      )}
      
      <section className="dashboard-grid">
         <div className="card map-container" style={{ padding: '0.5rem' }}>
            <h3 style={{ padding: '1rem' }}>Mapa de OcorrÃªncias</h3>
            <Map reports={reports} alerts={alerts} />
         </div>

         <div className="card feed-container">
            <h3>Feed Recente</h3>
            <div className="feed-list">
              {reports.length === 0 ? (
                <p className="text-muted">Nenhuma denÃºncia registrada ainda.</p>
              ) : (
                reports.slice(0, 10).map(report => (
                  <ReportCard key={report.id} report={report} />
                ))
              )}
            </div>
         </div>

         <div className="card ranking-container">
            <h3><TrendingUp size={20} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Problemas de Qualidade</h3>
            <div className="ranking-list" style={{ marginBottom: '2rem' }}>
              {rankings.map((rank, index) => (
                <div key={rank.bairro} className="ranking-item">
                  <span className="rank-position">{index + 1}</span>
                  <span className="rank-name">{rank.bairro}</span>
                  <span className="rank-count">{rank.count} denÃºncias</span>
                </div>
              ))}
              {rankings.length === 0 && <p className="text-muted">Sem dados suficientes.</p>}
            </div>

            <h3 style={{ color: '#ea580c' }}><AlertCircle size={20} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Maior Falta de Ãgua</h3>
            <div className="ranking-list">
              {shortageRankings.map((rank, index) => (
                <div key={rank.bairro} className="ranking-item">
                  <span className="rank-position">{index + 1}</span>
                  <span className="rank-name">{rank.bairro}</span>
                  <span className="rank-count" style={{ color: '#ea580c' }}>{rank.count} registros</span>
                </div>
              ))}
              {shortageRankings.length === 0 && <p className="text-muted">Nenhum registro no momento.</p>}
            </div>
         </div>
      </section>
    </div>
  );
}

