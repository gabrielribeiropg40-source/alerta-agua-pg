import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets } from 'lucide-react';
import FAB from './FAB';

export default function Layout({ children }) {
  return (
    <div className="layout-container">
      <header className="navbar">
        <div className="navbar-content">
          <Link to="/" className="logo">
            <Droplets className="logo-icon" />
            <span className="logo-text">Alerta Água <strong>PG</strong></span>
          </Link>
          <nav className="nav-links">
            <Link to="/login" className="nav-link">Entrar / Admin</Link>
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        {children}
      </main>
      
      <FAB />

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Alerta Água PG. Monitoramento Cidadão.</p>
      </footer>
    </div>
  );
}
