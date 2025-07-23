import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import DisparosLPS from './DisparosLPS';
import AdminCables from './AdminCables';
import Login from './Login';
import MenuMetodos from './MenuMetodos';
import DebugUsuario from './DebugUsuario';
import TablaUsuarios from './TablaUsuarios';
import VistaUsuarios from './VistaUsuarios';
import TablaDisparos from './TablaDisparos';
import DisparoCritico from './DisparoCritico';
import Localizaciones from './Localizaciones';
import TablaHistorial from './TablaHistorial';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function isLoggedIn() {
  return !!localStorage.getItem('gafete');
}

function PrivateRoute({ children }) {
  const location = useLocation();
  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function AppRoutes() {
  const [logged, setLogged] = useState(isLoggedIn());
  useEffect(() => {
    const onStorage = () => setLogged(isLoggedIn());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={logged ? <Navigate to="/menu-metodos" replace /> : <Navigate to="/login" replace />} />
      <Route path="/admin-cables" element={<PrivateRoute><AdminCables /></PrivateRoute>} />
      <Route path="/disparos-lps" element={<PrivateRoute><DisparosLPS /></PrivateRoute>} />
      <Route path="/menu-metodos" element={<PrivateRoute><MenuMetodos /></PrivateRoute>} />
      <Route path="/debug-usuario" element={<PrivateRoute><DebugUsuario /></PrivateRoute>} />
      <Route path="/tabla-usuarios" element={<PrivateRoute><TablaUsuarios /></PrivateRoute>} />
      <Route path="/gestion-usuarios" element={<PrivateRoute><VistaUsuarios /></PrivateRoute>} />
      <Route path="/tabla-disparos" element={<PrivateRoute><TablaDisparos /></PrivateRoute>} />
      <Route path="/tabla-historial" element={<PrivateRoute><TablaHistorial /></PrivateRoute>} />
      <Route path="/localizaciones" element={<PrivateRoute><Localizaciones /></PrivateRoute>} />
      <Route path="/disparo-critico" element={<PrivateRoute><DisparoCritico /></PrivateRoute>} />
      <Route path="*" element={<Navigate to={logged ? "/menu-metodos" : "/login"} replace />} />
    </Routes>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  </StrictMode>
);
