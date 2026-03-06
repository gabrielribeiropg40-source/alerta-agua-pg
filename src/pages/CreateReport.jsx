import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, dbReports, BairrosPG } from '../services/db';
import { spamFilter } from '../services/spamFilter';
import { compressImage } from '../services/imageOptimizer';
import SEO from '../components/SEO';
import { Camera, MapPin, AlertTriangle, Loader2 } from 'lucide-react';

export default function CreateReport() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    bairro: '', vila: '', cor_agua: 'normal', cheiro: 'sem cheiro', descricao: '', latitude: null, longitude: null, foto_url: ''
  });

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      setFormData(prev => ({ ...prev, bairro: currentUser.bairro, vila: currentUser.vila || '' }));
      
      const spamCheck = spamFilter.checkCanReport(currentUser.id);
      if (!spamCheck.allowed) {
        setError(spamCheck.error);
      } else {
        captureLocation();
      }
    }
  }, [navigate]);

  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({ 
            ...prev, 
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude 
          }));
        },
        (err) => {
          console.warn('GPS Error:', err.message);
        }
      );
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setLoading(true);
      const base64Image = await compressImage(file);
      setFormData(prev => ({ ...prev, foto_url: base64Image }));
    } catch (err) {
      setError('Erro ao processar a imagem.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (error) return; // Prevent if spam blocked

    if (!formData.bairro || !formData.cor_agua || !formData.cheiro) {
      setError('Preencha pelo menos o bairo, cor e cheiro da água.');
      return;
    }

    const report = {
      user_id: user.id,
      ...formData
    };

    const newReport = dbReports.add(report);
    navigate(`/denuncia/${newReport.id}`);
  };

  if (!user) return null;

  return (
    <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <SEO title="Nova Denúncia" description="Registre um problema de qualidade da água." />
      
      <h2>Registrar Problema na Água</h2>
      
      {error && (
        <div className="alert-banner">
          <AlertTriangle size={24} /> {error}
        </div>
      )}

      <form className="card form-group" onSubmit={handleSubmit}>
        
        <label>Bairro</label>
        <select className="input-field" value={formData.bairro} onChange={e => setFormData({...formData, bairro: e.target.value})} disabled={!!error}>
          {BairrosPG.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        
        <label>Vila/Loteamento (Opcional)</label>
        <input type="text" className="input-field" value={formData.vila} onChange={e => setFormData({...formData, vila: e.target.value})} disabled={!!error} />
        
        <label>Cor da Água</label>
        <select className="input-field" value={formData.cor_agua} onChange={e => setFormData({...formData, cor_agua: e.target.value})} disabled={!!error}>
          <option value="normal">Normal / Transparente</option>
          <option value="amarela">Amarela</option>
          <option value="marrom">Marrom / Barrenta</option>
          <option value="turva">Turva</option>
          <option value="esbranquiçada">Esbranquiçada</option>
        </select>
        
        <label>Cheiro da Água</label>
        <select className="input-field" value={formData.cheiro} onChange={e => setFormData({...formData, cheiro: e.target.value})} disabled={!!error}>
          <option value="sem cheiro">Sem Cheiro</option>
          <option value="cheiro forte">Cheiro Forte</option>
          <option value="cheiro de cloro">Cheiro de Cloro (Forte)</option>
          <option value="cheiro estranho">Cheiro Estranho (Esgoto/Terra)</option>
        </select>
        
        <label>Descrição Opcional</label>
        <textarea className="input-field" rows="3" placeholder="Detalhes de como a água está..." value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} disabled={!!error} />

        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
          {formData.foto_url ? (
            <div>
               <img src={formData.foto_url} alt="Preview" style={{ maxHeight: '200px', borderRadius: '8px', marginBottom: '0.5rem' }} />
               <button type="button" className="btn btn-secondary btn-sm" onClick={() => setFormData({...formData, foto_url: ''})}>Trocar Foto</button>
            </div>
          ) : (
            <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              {loading ? <Loader2 className="animate-spin" size={32} /> : <Camera size={32} color="var(--primary-color)" />}
              <span>Tirar ou Enviar Foto da Água</span>
              <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleImageUpload} disabled={!!error || loading} />
            </label>
          )}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <MapPin size={14} /> 
          {formData.latitude ? 'Localização GPS capturada' : 'Buscando localização GPS...'}
        </div>

        <button type="submit" className="btn btn-primary btn-large block" style={{ marginTop: '1.5rem' }} disabled={!!error || loading}>
          Enviar Denúncia
        </button>
      </form>
    </div>
  );
}
