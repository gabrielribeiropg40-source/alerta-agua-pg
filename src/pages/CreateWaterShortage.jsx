import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbReports, BairrosPG, auth } from '../services/db';
import SEO from '../components/SEO';
import { AlertCircle } from 'lucide-react';
import { spamFilter } from '../services/spamFilter';

export default function CreateWaterShortage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bairro: '',
    rua_localizacao: '',
    descricao: '',
    data: new Date().toISOString().substring(0, 10),
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const user = auth.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const spamCheck = spamFilter.checkCanReport(user.id);
    if (!spamCheck.allowed) {
      setError(spamCheck.error);
      return;
    }

    // Determine current GPS or use a static map center if not available
    const location = { latitude: -25.0916 + (Math.random() * 0.05 - 0.025), longitude: -50.1668 + (Math.random() * 0.05 - 0.025) };

    const newReport = {
      tipo: 'falta_agua',
      user_id: user.id,
      bairro: formData.bairro,
      rua_localizacao: formData.rua_localizacao,
      descricao: formData.descricao,
      foto_url: '', // optional photo upload can be injected here
      latitude: location.latitude,
      longitude: location.longitude,
      data: new Date(formData.data).toISOString(),
    };

    dbReports.add(newReport);
    setSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="page-container" style={{ maxWidth: '600px' }}>
      <SEO title="Registrar Falta de Água" />
      <div className="card shadow-md">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#ea580c' }}>
            <AlertCircle size={48} style={{ margin: '0 auto' }} />
            <h1 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>Registrar Falta de Água</h1>
            <p className="text-muted">Informe as áreas afetadas pela falta de abastecimento.</p>
        </div>

        {error && <div className="alert-banner" style={{ marginBottom: '1.5rem' }}>{error}</div>}
        {success && <div className="alert-banner" style={{ backgroundColor: '#dcfce3', color: '#166534', borderColor: '#bbf7d0', marginBottom: '1.5rem' }}>Registro salvo com sucesso! Redirecionando...</div>}

        <form className="form-group" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label>Bairro Afetado</label>
            <select required className="input-field" value={formData.bairro} onChange={e => setFormData({...formData, bairro: e.target.value})}>
              <option value="">Selecione o Bairro</option>
              {BairrosPG.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label>Rua ou Localização exata</label>
            <input type="text" required className="input-field" placeholder="Ex: Rua Balduíno Taques, 40" value={formData.rua_localizacao} onChange={e => setFormData({...formData, rua_localizacao: e.target.value})} />
          </div>

          <div>
            <label>Data de Início da Falta</label>
            <input type="date" required className="input-field" value={formData.data} onChange={e => setFormData({...formData, data: e.target.value})} />
          </div>

          <div>
            <label>Descrição do Problema</label>
            <textarea required className="input-field" rows="3" placeholder="Ex: Sem água desde a manhã de hoje, caminhão pipa não passou." value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})}></textarea>
          </div>

          <div className="alert-banner" style={{ fontSize: '0.85rem', backgroundColor: '#fff7ed', color: '#9a3412', borderColor: '#fed7aa' }}>
            📍 O seu relato será exibido no mapa com a localização da ocorrência.
          </div>

          <button type="submit" className="btn btn-secondary block" style={{ backgroundColor: '#ea580c', color: 'white', border: 'none', padding: '1rem', fontSize: '1.1rem' }}>
            Enviar Registro
          </button>
        </form>
      </div>
    </div>
  );
}


