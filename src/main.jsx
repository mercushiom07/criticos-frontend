import TablaHistorial from './TablaHistorial';
      <Route path="/tabla-historial" element={<TablaHistorial />} />
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import HomeRouter from './HomeRouter';
import DisparosLPS from './DisparosLPS';
import AdminCables from './AdminCables';
import Login from './Login';
import MenuMetodos from './MenuMetodos';
import DebugUsuario from './DebugUsuario';
import TablaUsuarios from './TablaUsuarios';
import VistaUsuarios from './VistaUsuarios';
import TablaDisparos from './TablaDisparos';
import Localizaciones from './Localizaciones';
      <Route path="/tabla-disparos" element={<TablaDisparos />} />
import { HashRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomeRouter />} />
        <Route path="/disparo-critico" element={<App />} />
        <Route path="/admin-cables" element={<AdminCables />} />
        <Route path="/disparos-lps" element={<DisparosLPS />} />
        <Route path="/menu-metodos" element={<MenuMetodos />} />
        <Route path="/debug-usuario" element={<DebugUsuario />} />
      <Route path="/tabla-usuarios" element={<TablaUsuarios />} />
      <Route path="/gestion-usuarios" element={<VistaUsuarios />} />
        <Route path="/tabla-disparos" element={<TablaDisparos />} />
        <Route path="/tabla-historial" element={<TablaHistorial />} />
        <Route path="/localizaciones" element={<Localizaciones />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);
