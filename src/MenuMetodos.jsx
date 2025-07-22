
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUsuario } from './db';

export default function MenuMetodos() {
  const [usuario, setUsuario] = useState(null);
  useEffect(() => {
    const gafete = localStorage.getItem('gafete');
    if (gafete) {
      getUsuario(gafete).then(u => setUsuario(u));
    }
  }, []);
  const handleCerrarSesion = () => {
    localStorage.removeItem('gafete');
    window.location.href = '/login';
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
        { to: '/', label: 'Disparo de cable' },
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
        { to: '/', label: 'Disparo de cable' },
        { to: '/tabla-historial', label: 'Ver historial' },
        { to: '/gestion-usuarios', label: 'Gestión de usuarios' },
      ];
    } else if (dept === 'MFG' && (tipo === 'RUTERO' || tipo === 'OPERADOR')) {
      accesos = [
        { to: '/', label: 'Disparo de cable' },
        { to: '/tabla-historial', label: 'Ver historial' },
      ];
    }
  }

  return (
    <div className="container" style={{maxWidth: 600, margin: '4rem auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em'}}>
        <span style={{fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em'}}>
          Usuario: {usuario?.NOMBRE || ''}
        </span>
        <button className="btn" style={{width: 140, background: '#b71c1c'}} onClick={handleCerrarSesion}>Cerrar sesión</button>
      </div>
      <h1 style={{textAlign: 'center', color: '#1976d2', marginBottom: '1.5em'}}>Menú</h1>
      <div style={{display: 'flex', flexDirection: 'column', gap: '2em', alignItems: 'center'}}>
        {accesos.map(a => (
          <Link key={a.to} to={a.to} className="btn" style={{width: '60%', textAlign: 'center'}}>{a.label}</Link>
        ))}
      </div>
    </div>
  );
}
