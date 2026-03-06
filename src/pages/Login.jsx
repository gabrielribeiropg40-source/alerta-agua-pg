import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../services/db';
import SEO from '../components/SEO';
import { AlertTriangle } from 'lucide-react';
import { adminAuth } from '../services/adminAuth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'gabriel.ribeiro.pg40@gmail.com' && senha === 'yaksumo9936') {
      adminAuth.login(email, senha);
      navigate('/admin-alerta-pg/dashboard');
      return;
    }
    const res = auth.login(email, senha);
    if (res.success) {
      if (res.user.role === 'admin') navigate('/admin');
      else navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-container">
      <SEO title="Entrar" description="Faça login no Alerta Água PG" />
      <div className="card shadow-md">
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Entrar</h2>
        
        {error && (
          <div className="alert-banner" style={{ marginTop: '1rem', padding: '0.5rem', fontSize: '0.9rem' }}>
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        <form className="form-group" onSubmit={handleSubmit}>
          <input 
            type="email" required placeholder="E-mail" className="input-field" 
            value={email} onChange={e => setEmail(e.target.value)}
          />
          <input 
            type="password" required placeholder="Senha" className="input-field" 
            value={senha} onChange={e => setSenha(e.target.value)}
          />
          <button type="submit" className="btn btn-primary block" style={{ marginTop: '1rem' }}>
            Entrar
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          Não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

