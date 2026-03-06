import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, BairrosPG } from '../services/db';
import SEO from '../components/SEO';
import { AlertTriangle } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '', email: '', senha: '', bairro: BairrosPG[0], vila: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.email || !formData.senha || !formData.bairro) {
      setError('Preencha os campos obrigatórios.');
      return;
    }
    
    // Simple email validation
    if (!formData.email.includes('@')) {
      setError('E-mail inválido.');
      return;
    }

    const res = auth.register(formData);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-container">
      <SEO title="Cadastro" description="Crie sua conta no Alerta Água PG" />
      <div className="card shadow-md">
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Cadastro de Morador</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Junte-se para fiscalizar a nossa água</p>
        
        {error && (
          <div className="alert-banner" style={{ marginTop: '1rem', padding: '0.5rem', fontSize: '0.9rem' }}>
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        <form className="form-group" onSubmit={handleSubmit}>
          <input 
            type="text" required placeholder="Seu Nome Completo" className="input-field" 
            value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})}
          />
          <input 
            type="email" required placeholder="E-mail" className="input-field" 
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" required placeholder="Senha" className="input-field" 
            value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})}
          />
          
          <select 
            required
            className="input-field" 
            value={formData.bairro} 
            onChange={e => setFormData({...formData, bairro: e.target.value})}
          >
            <option value="" disabled>Selecione seu Bairro...</option>
            {BairrosPG.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          
          <input 
            type="text" placeholder="Nome da Vila/Loteamento (Opcional)" className="input-field" 
            value={formData.vila} onChange={e => setFormData({...formData, vila: e.target.value})}
          />

          <button type="submit" className="btn btn-primary block" style={{ marginTop: '1rem' }}>
            Criar Conta
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          Já possui conta? <Link to="/login">Faça Login</Link>
        </p>
      </div>
    </div>
  );
}
