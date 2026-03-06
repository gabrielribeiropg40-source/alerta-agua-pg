import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, Map, TrendingUp, Download, Settings, LogOut, Droplets } from 'lucide-react';
import { adminAuth } from '../services/adminAuth';
import { generateWeeklyReport } from '../services/pdfGenerator';

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    adminAuth.logout();
    navigate('/admin-alerta-pg');
  };

  const navItemClass = ({ isActive }) => 
    `admin-nav-item ${isActive ? 'active' : ''}`;

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
         <Droplets size={28} color="white" />
         <div style={{ color: 'white' }}>
            <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Alerta Água PG</h2>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Admin Dashboard</span>
         </div>
      </div>

      <nav className="admin-sidebar-nav">
         <NavLink to="/admin-alerta-pg/dashboard" className={navItemClass} end>
           <LayoutDashboard size={20} /> Dashboard
         </NavLink>
         <NavLink to="/admin-alerta-pg/dashboard?tab=denuncias" className={navItemClass}>
           <AlertTriangle size={20} /> Denúncias
         </NavLink>
         <NavLink to="/admin-alerta-pg/dashboard?tab=mapa" className={navItemClass}>
           <Map size={20} /> Mapa de Denúncias
         </NavLink>
         <NavLink to="/admin-alerta-pg/dashboard?tab=ranking" className={navItemClass}>
           <TrendingUp size={20} /> Ranking de Bairros
         </NavLink>
         
         <div style={{ margin: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}></div>
         
         <button className="admin-nav-item" onClick={generateWeeklyReport} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem' }}>
           <Download size={20} /> Relatórios PDF
         </button>
         <button className="admin-nav-item" onClick={() => alert('Configurações do sistema (Em breve)')} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem' }}>
           <Settings size={20} /> Configurações
         </button>
      </nav>

      <div className="admin-sidebar-footer">
         <button className="btn btn-secondary block" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}>
            <LogOut size={18} /> Sair do Painel
         </button>
      </div>
    </aside>
  );
}
