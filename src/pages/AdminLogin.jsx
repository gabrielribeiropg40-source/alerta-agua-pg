import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuth } from '../services/adminAuth';
import SEO from '../components/SEO';
import { ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  // Auto-redirect if already logged in
  useEffect(() => {
    if (adminAuth.isAuthenticated()) {
      navigate('/admin-alerta-pg/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = adminAuth.login(email, senha);
    if (res.success) {
      navigate('/admin-alerta-pg/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-container" style={{ minHeight: '100vh', background: '#e2e8f0', margin: '-1rem' }}>
      <SEO title="Admin Restrito" />
      <div className="card shadow-lg" style={{ maxWidth: '450px', width: '100%', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
           <ShieldAlert size={48} style={{ margin: '0 auto' }} />
           <h2 style={{ marginTop: '0.5rem' }}>Painel Administrativo</h2>
           <p className="text-muted" style={{ fontSize: '0.9rem' }}>Acesso Restrito</p>
        </div>
        
        {error && (
          <div className="alert-banner" style={{ marginTop: '1rem', padding: '0.75rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form className="form-group" onSubmit={handleSubmit}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>E-mail Administrativo</label>
          <input 
            type="email" required placeholder="gabriel.ribeiro...@" className="input-field" 
            value={email} onChange={e => setEmail(e.target.value)}
          />
          
          <label style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.5rem' }}>Senha de Segurança</label>
          <input 
            type="password" required placeholder="••••••••" className="input-field" 
            value={senha} onChange={e => setSenha(e.target.value)}
          />

          <button type="submit" className="btn btn-primary block" style={{ marginTop: '1.5rem', padding: '0.875rem' }}>
            Autenticar Sessão
          </button>
        </form>
      </div>
    </div>
  );
}
