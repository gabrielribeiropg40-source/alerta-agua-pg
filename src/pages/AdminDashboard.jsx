import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminAuth } from '../services/adminAuth';
import { dbReports } from '../services/db';
import AdminSidebar from '../components/AdminSidebar';
import AdminReportsTable from '../components/AdminReportsTable';
import AdminMap from '../components/AdminMap';
import SEO from '../components/SEO';
import { Download, TrendingUp, AlertTriangle } from 'lucide-react';
import { generateWeeklyReport } from '../services/pdfGenerator';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const param = new URLSearchParams(location.search).get('tab');
  const [reports, setReports] = useState([]);
  
  // Dashboard Metrics
  const [metrics, setMetrics] = useState({
    total: 0, last24h: 0, topBairro: '-', ultimateReport: null
  });
  const [ranking, setRanking] = useState([]);
  const [chartData, setChartData] = useState([]);

  const loadData = () => {
    let all = dbReports.getAll();
    all.sort((a, b) => new Date(b.data) - new Date(a.data));
    setReports(all);

    const now = new Date();
    const last24hCount = all.filter(r => (now - new Date(r.data)) / (1000*60*60) <= 24).length;
    
    const counts = {};
    const dateCounts = {};
    
    all.forEach(r => {
      // Neighborhood counts
      counts[r.bairro] = (counts[r.bairro] || 0) + 1;
      
      // Chart data grouping (Last 7 dates)
      const dateStr = new Date(r.data).toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'});
      dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
    });

    const rankList = Object.entries(counts).sort((a,b) => b[1] - a[1]);
    const topBairro = rankList.length > 0 ? rankList[0][0] : '-';
    
    setRanking(rankList.slice(0, 5));
    
    // Create Chart Array
    const chartArr = Object.entries(dateCounts).map(([date, count]) => ({ date, count })).slice(0, 7).reverse();
    setChartData(chartArr);

    setMetrics({
      total: all.length,
      last24h: last24hCount,
      topBairro,
      ultimateReport: all.length > 0 ? all[0] : null
    });
  };

  useEffect(() => {
    if (!adminAuth.isAuthenticated()) {
      navigate('/admin-alerta-pg');
    } else {
      loadData();
    }
  }, [navigate]);

  return (
    <div className="admin-layout">
      <SEO title="Painel Secreto | Alerta Água PG" />
      <AdminSidebar />
      
      <main className="admin-main">
        <header className="admin-header">
           <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Dashboard Administrativo</h1>
           <button className="btn btn-primary" onClick={generateWeeklyReport}>
             <Download size={18} /> Gerar Relatório PDF
           </button>
        </header>
        
        <div className="admin-content">
          {(!param || param === 'dashboard') && (
            <>
              {/* Metrics Cards */}
              <div className="admin-metrics-grid">
                <div className="card shadow-md">
                  <span className="text-muted">Total de Denúncias</span>
                  <div className="admin-metric-value">{metrics.total}</div>
                </div>
                <div className="card shadow-md">
                  <span className="text-muted">Últimas 24 Horas</span>
                  <div className="admin-metric-value" style={{ color: 'var(--warning-color)' }}>{metrics.last24h}</div>
                </div>
                <div className="card shadow-md">
                  <span className="text-muted">Bairro Mais Afetado</span>
                  <div className="admin-metric-value" style={{ fontSize: '1.5rem', color: 'var(--danger-color)' }}>{metrics.topBairro}</div>
                </div>
                <div className="card shadow-md">
                  <span className="text-muted">Última Denúncia</span>
                  <div style={{ fontWeight: 500, marginTop: '0.5rem', fontSize: '1.1rem' }}>
                    {metrics.ultimateReport ? metrics.ultimateReport.bairro : '-'}
                  </div>
                  <small className="text-muted">{metrics.ultimateReport ? new Date(metrics.ultimateReport.data).toLocaleString('pt-BR') : ''}</small>
                </div>
              </div>

              <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
                {/* Simplified Chart (CSS Based) */}
                <div className="card shadow-md" style={{ gridColumn: 'span 2' }}>
                   <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <TrendingUp color="var(--primary-color)" /> Crescimento de Denúncias Recentes
                   </h3>
                   <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem', height: '200px', paddingBottom: '2rem', overflowX: 'auto', borderBottom: '1px solid var(--border-color)' }}>
                     {chartData.map(d => {
                        const heightPercent = metrics.total > 0 ? (d.count / metrics.total) * 100 : 0;
                        const finalHeight = heightPercent < 10 ? Math.max(heightPercent * 5, 20) : heightPercent * 2; // Scaling for visibility
                        return (
                          <div key={d.date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                            <div style={{ width: '40px', background: 'var(--primary-color)', height: `${Math.min(finalHeight, 180)}px`, borderRadius: '4px 4px 0 0', position: 'relative' }}>
                              <span style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold' }}>{d.count}</span>
                            </div>
                            <span style={{ fontSize: '0.8rem', marginTop: '0.5rem', whiteSpace: 'nowrap' }}>{d.date}</span>
                          </div>
                        );
                     })}
                     {chartData.length === 0 && <p className="text-muted">Sem dados recentes.</p>}
                   </div>
                </div>
              </div>
            </>
          )}

          {param === 'denuncias' && (
            <AdminReportsTable reports={reports} setReports={setReports} reloadData={loadData} />
          )}

          {param === 'mapa' && (
            <div className="card shadow-md" style={{ padding: '0.5rem' }}>
               <h3 style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', margin: 0 }}>Mapa Geral de Ocorrências</h3>
               <AdminMap reports={reports} />
            </div>
          )}

          {(param === 'ranking' || param === 'dashboard') && (
            <div className="card shadow-md" style={{ marginTop: '2rem' }}>
               <h3>Ranking de Bairros Atuais</h3>
               <div className="ranking-list">
                 {ranking.map((rank, index) => (
                   <div key={rank[0]} className="ranking-item">
                     <span className="rank-position">{index + 1}º</span>
                     <span className="rank-name">{rank[0]}</span>
                     <span className="rank-count">{rank[1]} denúncias</span>
                   </div>
                 ))}
                 {ranking.length === 0 && <p className="text-muted">Sem dados.</p>}
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
