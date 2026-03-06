// src/services/adminAuth.js

const ADMIN_EMAIL = 'gabriel.ribeiro.pg40@gmail.com';
const ADMIN_PASS = 'yaksumo9936';

export const adminAuth = {
  login: (email, senha) => {
    if (email === ADMIN_EMAIL && senha === ADMIN_PASS) {
      const sessionData = {
        role: 'superadmin',
        email: ADMIN_EMAIL,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('alerta_agua_admin_session', JSON.stringify(sessionData));
      return { success: true };
    }
    return { success: false, message: 'Credenciais administrativas inválidas' };
  },
  
  logout: () => {
    localStorage.removeItem('alerta_agua_admin_session');
  },
  
  isAuthenticated: () => {
    const session = localStorage.getItem('alerta_agua_admin_session');
    if (!session) return false;
    
    try {
      const parsed = JSON.parse(session);
      return parsed.role === 'superadmin' && parsed.email === ADMIN_EMAIL;
    } catch (e) {
      return false;
    }
  }
};
