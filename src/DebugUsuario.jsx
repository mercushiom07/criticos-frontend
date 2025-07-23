import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { debugCheckGafete, addUsuario } from './db';

export default function DebugUsuario() {
  const navigate = useNavigate();
  const handleCerrarSesion = () => {
    localStorage.removeItem('gafete');
    navigate('/login', { replace: true });
  };
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    checkUsuario();
    // eslint-disable-next-line
  }, []);

  async function checkUsuario() {
    const result = await debugCheckGafete('60507586');
    setUsuario(result);
  }

  async function handleAddUsuario() {
    await addUsuario({
      NOMBRE: 'Isaias Uribe',
      GAFETE: '60507586',
      DEPARTAMENTO: 'METODOS',
      RUTA_MAQUINA: 'INGENIERIA',
      TIPO_USUARIO: 'ADMIN'
    });
    await checkUsuario();
    alert('Usuario agregado');
  }

  return (
    <div className="responsive-debug">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em'}}>
        <h2 className="debug-title">Verificación de usuario por gafete</h2>
        <button className="btn" style={{background: '#d32f2f'}} onClick={handleCerrarSesion}>Cerrar sesión</button>
      </div>
      <div className="debug-content">
        <button className="btn debug-btn" onClick={handleAddUsuario}>Agregar usuario Isaias Uribe</button>
        {usuario ? (
          <pre className="debug-pre">{JSON.stringify(usuario, null, 2)}</pre>
        ) : (
          <span className="debug-msg">No se encontró el usuario con gafete 60507586.</span>
        )}
      </div>
    </div>
  );
}
