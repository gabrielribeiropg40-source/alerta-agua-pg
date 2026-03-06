import React, { useState, useEffect } from 'react';
import { dbReports, BairrosPG } from '../services/db';
import { Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminReportsTable({ reports, setReports, reloadData }) {
  const [filters, setFilters] = useState({ bairro: '', tipo: '', data: '' });
  const [filtered, setFiltered] = useState(reports);

  useEffect(() => {
    let result = [...reports];
    if (filters.bairro) result = result.filter(r => r.bairro === filters.bairro);
    if (filters.tipo) result = result.filter(r => r.cor_agua === filters.tipo || r.cheiro === filters.tipo);
    if (filters.data) {
        // filter by specific YYYY-MM-DD
        result = result.filter(r => r.data.startsWith(filters.data));
    }
    setFiltered(result);
  }, [filters, reports]);

  const handleDelete = (id) => {
    if (window.confirm('Excluir essa denúncia permanentemente?')) {
      dbReports.delete(id);
      reloadData();
    }
  };

  return (
    <div className="card shadow-md">
      <h3 style={{ marginBottom: '1rem' }}>Gerenciamento de Denúncias</h3>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <select className="input-field" value={filters.bairro} onChange={(e) => setFilters({...filters, bairro: e.target.value})} style={{ flex: 1, minWidth: '150px' }}>
          <option value="">Todos os Bairros</option>
          {BairrosPG.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select className="input-field" value={filters.tipo} onChange={(e) => setFilters({...filters, tipo: e.target.value})} style={{ flex: 1, minWidth: '150px' }}>
          <option value="">Qualquer Problema</option>
          <option value="amarela">Água Amarela</option>
          <option value="marrom">Água Marrom</option>
          <option value="turva">Água Turva</option>
          <option value="cheiro forte">Cheiro Forte</option>
        </select>
        <input type="date" className="input-field" value={filters.data} onChange={(e) => setFilters({...filters, data: e.target.value})} style={{ flex: 1, minWidth: '150px' }} />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '0.75rem' }}>ID</th>
              <th style={{ padding: '0.75rem' }}>Data</th>
              <th style={{ padding: '0.75rem' }}>Bairro</th>
              <th style={{ padding: '0.75rem' }}>Cor / Cheiro</th>
              <th style={{ padding: '0.75rem' }}>Descrição</th>
              <th style={{ padding: '0.75rem' }}>Foto</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>{r.id.substring(0,6)}</td>
                <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>{new Date(r.data).toLocaleDateString('pt-BR')}</td>
                <td style={{ padding: '0.75rem', fontWeight: 500 }}>{r.bairro}</td>
                <td style={{ padding: '0.75rem' }}>
                    <span className="report-badge" data-color={r.cor_agua} style={{ marginBottom: '0.25rem' }}>{r.cor_agua}</span><br/>
                    <span style={{ fontSize: '0.8rem' }}>{r.cheiro}</span>
                </td>
                <td style={{ padding: '0.75rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.descricao || '-'}
                </td>
                <td style={{ padding: '0.75rem' }}>
                    {r.foto_url ? <a href={r.foto_url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontSize: '0.85rem' }}>Ver Foto</a> : '-'}
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <Link to={`/denuncia/${r.id}`} target="_blank" className="btn btn-secondary btn-sm" style={{ padding: '0.4rem', color: 'var(--text-main)' }} title="Visualizar">
                      <Eye size={16} />
                    </Link>
                    <button className="btn btn-secondary btn-sm" style={{ padding: '0.4rem', color: 'var(--danger-color)' }} onClick={() => handleDelete(r.id)} title="Excluir">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhuma denúncia corresponde aos filtros.</p>}
      </div>
    </div>
  );
}
