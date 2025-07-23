

import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUsuario, limpiarGafete } from './db';

export default function MenuMetodos() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  useEffect(() => {
    const gafete = localStorage.getItem('gafete');
    if (gafete) {
      getUsuario(limpiarGafete(gafete)).then(u => setUsuario(u));
    }
  }, []);
  const handleCerrarSesion = () => {
    localStorage.removeItem('gafete');
    navigate('/login', { replace: true });
  };

  // Matriz de accesos
  let accesos = [];
  if (usuario) {
    const dept = usuario.DEPARTAMENTO;
    const tipo = usuario.TIPO_USUARIO;
    if (dept === 'MATERIALES' && tipo === 'ADMIN') {
      accesos = [
        { to: '/tabla-disparos', label: 'Ver tabla de disparos' },
        { to: '/tabla-historial', label: 'Ver historial' },
        { to: '/gestion-usuarios', label: 'Gestión de usuarios' },
      ];
    } else if (dept === 'MATERIALES' && tipo === 'RUTERO') {
      accesos = [
        { to: '/tabla-disparos', label: 'Ver tabla de disparos' },
        { to: '/tabla-historial', label: 'Ver historial' },
      ];
    } else if (dept === 'METODOS' && tipo === 'ADMIN') {
      accesos = [
        { to: '/disparo-critico', label: 'Disparo de cable' },
        { to: '/disparos-lps', label: 'Disparo LPS' },
        { to: '/admin-cables', label: 'Administración de cables' },
        { to: '/tabla-disparos', label: 'Ver tabla de disparos' },
        { to: '/tabla-historial', label: 'Ver historial' },
        { to: '/tabla-usuarios', label: 'Ver tabla de usuarios' },
        { to: '/gestion-usuarios', label: 'Gestión de usuarios' },
        { to: '/localizaciones', label: 'Localizaciones' },
      ];
    } else if (dept === 'CORTE' && tipo === 'ADMIN') {
      accesos = [
        { to: '/tabla-disparos', label: 'Ver tabla de disparos' },
        { to: '/tabla-historial', label: 'Ver historial' },
        { to: '/gestion-usuarios', label: 'Gestión de usuarios' },
      ];
    } else if (dept === 'CORTE' && (tipo === 'RUTERO' || tipo === 'OPERADOR')) {
      accesos = [
        { to: '/tabla-disparos', label: 'Ver tabla de disparos' },
        { to: '/tabla-historial', label: 'Ver historial' },
      ];
    } else if (dept === 'LPS' && tipo === 'ADMIN') {
      accesos = [
        { to: '/disparos-lps', label: 'Disparo LPS' },
        { to: '/tabla-historial', label: 'Ver historial' },
        { to: '/gestion-usuarios', label: 'Gestión de usuarios' },
      ];
    } else if (dept === 'LPS' && (tipo === 'RUTERO' || tipo === 'OPERADOR')) {
      accesos = [
        { to: '/disparos-lps', label: 'Disparo LPS' },
        { to: '/tabla-historial', label: 'Ver historial' },
      ];
    } else if (dept === 'MFG' && tipo === 'ADMIN') {
      accesos = [
        { to: '/disparo-critico', label: 'Disparo de cable' },
        { to: '/tabla-historial', label: 'Ver historial' },
        { to: '/gestion-usuarios', label: 'Gestión de usuarios' },
      ];
    } else if (dept === 'MFG' && (tipo === 'RUTERO' || tipo === 'OPERADOR')) {
      accesos = [
        { to: '/disparo-critico', label: 'Disparo de cable' },
        { to: '/tabla-historial', label: 'Ver historial' },
      ];
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: 0 }}>
      <div style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontWeight: 'bold', color: '#1976d2' }}>Usuario: {usuario?.NOMBRE || ''}</span>
          <button style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer' }} onClick={handleCerrarSesion}>Cerrar sesión</button>
        </div>
        <h1 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>Menú</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          {accesos.map(a => (
            <Link key={a.to} to={a.to} style={{ flex: '1 1 200px', margin: 0, background: '#fff', border: '1px solid #1976d2', color: '#1976d2', borderRadius: 4, padding: '12px 0', textAlign: 'center', textDecoration: 'none', fontWeight: 500, fontSize: 16 }}>{a.label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
