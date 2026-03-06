// src/services/db.js
// Mocked Supabase Database Layer

// INITIAL MOCK DATA
const initialUsers = [
  { id: 'u1', nome: 'Admin', email: 'admin@alerta.com', senha: '123', bairro: 'Uvaranas', vila: 'Centro', data_cadastro: new Date().toISOString(), role: 'admin' },
];

const initialReports = [
  { id: 'd1', user_id: 'u1', bairro: 'Uvaranas', vila: 'Vila Marina', cor_agua: 'turva', cheiro: 'cheiro forte', descricao: 'A água está barrenta desde ontem.', foto_url: '', latitude: -25.0916, longitude: -50.1668, data: new Date().toISOString() }
];

export const BairrosPG = [
  "Uvaranas", "Nova Rússia", "Neves", "Contorno", "Cará-Cará", 
  "Oficinas", "Ronda", "Boa Vista", "Chapada", "Olarias", 
  "Colônia Dona Luiza", "Jardim Carvalho", "Santa Paula", "Santa Terezinha", 
  "Sabará", "Dom Bosco", "Vila Estrela", "Vila Cipa", "Vila Ricci", 
  "Vila Coronel Cláudio", "Vila Marina", "Vila Palmeirinha", "Vila Ana Rita", 
  "Vila DER", "Vila Hilgemberg"
];

// INIT DB
export const initDB = () => {
  if (!localStorage.getItem('alerta_agua_users')) {
    localStorage.setItem('alerta_agua_users', JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem('alerta_agua_reports')) {
    localStorage.setItem('alerta_agua_reports', JSON.stringify(initialReports));
  }
};

// USERS API
export const dbUsers = {
  getAll: () => JSON.parse(localStorage.getItem('alerta_agua_users') || '[]'),
  save: (data) => localStorage.setItem('alerta_agua_users', JSON.stringify(data)),
  add: (user) => {
    const users = dbUsers.getAll();
    const newUser = { id: 'u' + Date.now(), role: 'user', data_cadastro: new Date().toISOString(), ...user };
    users.push(newUser);
    dbUsers.save(users);
    return newUser;
  },
  findByEmail: (email) => {
    return dbUsers.getAll().find(u => u.email === email);
  },
  findById: (id) => {
    return dbUsers.getAll().find(u => u.id === id);
  }
};

// REPORTS API
export const dbReports = {
  getAll: () => JSON.parse(localStorage.getItem('alerta_agua_reports') || '[]'),
  save: (data) => localStorage.setItem('alerta_agua_reports', JSON.stringify(data)),
  add: (report) => {
    const reports = dbReports.getAll();
    const newReport = { id: 'd' + Date.now(), data: new Date().toISOString(), ...report };
    reports.push(newReport);
    dbReports.save(reports);
    return newReport;
  },
  findById: (id) => {
    return dbReports.getAll().find(r => r.id === id);
  },
  delete: (id) => {
    const reports = dbReports.getAll().filter(r => r.id !== id);
    dbReports.save(reports);
  }
};

// AUTH API
export const auth = {
  login: (email, senha) => {
    const user = dbUsers.findByEmail(email);
    if (user && user.senha === senha) {
      localStorage.setItem('alerta_agua_session', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: 'Credenciais inválidas' };
  },
  register: (userData) => {
    if (dbUsers.findByEmail(userData.email)) {
      return { success: false, message: 'Email já cadastrado' };
    }
    const user = dbUsers.add(userData);
    localStorage.setItem('alerta_agua_session', JSON.stringify(user));
    return { success: true, user };
  },
  logout: () => {
    localStorage.removeItem('alerta_agua_session');
  },
  getCurrentUser: () => {
    const session = localStorage.getItem('alerta_agua_session');
    return session ? JSON.parse(session) : null;
  }
};

initDB();
