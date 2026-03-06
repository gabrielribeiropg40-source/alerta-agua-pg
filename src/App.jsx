import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateReport from './pages/CreateReport';
import CreateWaterShortage from './pages/CreateWaterShortage';
import ReportDetail from './pages/ReportDetail';
import Admin from './pages/Admin'; // Legacy admin
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Secret Admin Routes */}
        <Route path="/admin-alerta-pg" element={<AdminLogin />} />
        <Route path="/admin-alerta-pg/dashboard" element={<AdminDashboard />} />

        {/* Public Application Routes */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/denuncia/nova" element={<CreateReport />} />
              <Route path="/falta-agua/nova" element={<CreateWaterShortage />} />
              <Route path="/denuncia/:id" element={<ReportDetail />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
