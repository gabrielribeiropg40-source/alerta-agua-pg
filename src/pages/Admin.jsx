import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, dbReports, dbUsers, BairrosPG } from '../services/db';
import { generateWeeklyReport } from '../services/pdfGenerator';
import Map from '../components/Map';
import SEO from '../components/SEO';
import { Download, Trash2, ShieldAlert } from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [reports, setReports] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  
  const [filters, setFilters] = useState({ bairro: '', tipo: '' });

  const loadData = () => {
    let allReports = dbReports.getAll();
    allReports.sort((a, b) => new Date(b.data) - new Date(a.data));
    
    if (filters.bairro) {
      allReports = allReports.filter(r => r.bairro === filters.bairro);
    }
    if (filters.tipo) {
      allReports = allReports.filter(r => r.cor_agua === filters.tipo || r.cheiro === filters.tipo);
    }

    setReports(allReports);
    setUsersCount(dbUsers.getAll().length);
  };

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      setIsAdmin(true);
      loadData();
    }
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta denúncia?')) {
      dbReports.delete(id);
      loadData();
    }
  };

  if (!isAdmin) return null;

  const res24h = reports.filter(r => (new Date() - new Date(r.data)) / (1000 * 60 * 60) <= 24).length;

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <SEO title="Painel Admin" description="Administração" />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2><ShieldAlert color="var(--primary-color)" /> Painel Administrador</h2>
        <button className="btn btn-secondary" onClick={generateWeeklyReport}>
          <Download size={18} /> Exportar PDF Semanal
        </button>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="card shadow-md" style={{ textAlign: 'center' }}>
          <h3 className="text-muted" style={{ fontSize: '1rem' }}>Total Usuários</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{usersCount}</p>
        </div>
        <div className="card shadow-md" style={{ textAlign: 'center' }}>
          <h3 className="text-muted" style={{ fontSize: '1rem' }}>Total Denúncias</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{reports.length}</p>
        </div>
        <div className="card shadow-md" style={{ textAlign: 'center' }}>
          <h3 className="text-muted" style={{ fontSize: '1rem' }}>Denúncias (24h)</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>{res24h}</p>
        </div>
      </div>

      <div className="card shadow-md map-container" style={{ padding: '0.5rem', marginBottom: '2rem' }}>
         <h3 style={{ padding: '1rem' }}>Mapa Completo de Ocorrências</h3>
         <Map reports={reports} alerts={[]} height="300px" />
      </div>

      <div className="card shadow-md">
        <h3 style={{ marginBottom: '1rem' }}>Tabela de Denúncias</h3>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <select className="input-field" value={filters.bairro} onChange={(e) => setFilters({...filters, bairro: e.target.value})} style={{ flex: 1, minWidth: '200px' }}>
            <option value="">Todos os Bairros</option>
            {BairrosPG.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select className="input-field" value={filters.tipo} onChange={(e) => setFilters({...filters, tipo: e.target.value})} style={{ flex: 1, minWidth: '200px' }}>
            <option value="">Qualquer Problema</option>
            <option value="amarela">Água Amarela</option>
            <option value="marrom">Água Marrom</option>
            <option value="cheiro forte">Cheiro Forte</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--primary-light)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem' }}>Data</th>
                <th style={{ padding: '0.75rem' }}>Bairro</th>
                <th style={{ padding: '0.75rem' }}>Problema</th>
                <th style={{ padding: '0.75rem' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem' }}>{new Date(r.data).toLocaleDateString('pt-BR')}</td>
                  <td style={{ padding: '0.75rem' }}>{r.bairro}</td>
                  <td style={{ padding: '0.75rem' }}>{r.cor_agua} / {r.cheiro}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button className="btn btn-secondary btn-sm" style={{ color: 'var(--danger-color)', padding: '0.5rem' }} onClick={() => handleDelete(r.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reports.length === 0 && <p style={{ padding: '1rem', textAlign: 'center' }}>Nenhuma denúncia encontrada.</p>}
        </div>
      </div>
    </div>
  );
}
