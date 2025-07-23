import { useState } from 'react';
import { getUsuario, addUsuario, limpiarGafete } from './db';

export default function VistaUsuarios() {
  const [gafete, setGafete] = useState('');
  const [nombre, setNombre] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [ruta, setRuta] = useState('');
  const [tipo, setTipo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    if (!gafete || !nombre || !departamento || !tipo) {
      setMensaje('Completa todos los campos obligatorios');
      return;
    }
    const existe = await getUsuario(limpiarGafete(gafete));
    if (existe) {
      setMensaje('El gafete ya existe');
      return;
    }
    await addUsuario({
      GAFETE: limpiarGafete(gafete),
      NOMBRE: nombre,
      DEPARTAMENTO: departamento,
      RUTA_MAQUINA: ruta,
      TIPO_USUARIO: tipo
    });
    setMensaje('Usuario agregado');
    setGafete(''); setNombre(''); setDepartamento(''); setRuta(''); setTipo('');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', minWidth: 320 }}>
        <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>Agregar usuario</h2>
        <div style={{ marginBottom: 12 }}>
          <input type="text" placeholder="Gafete*" value={gafete} onChange={e => setGafete(e.target.value)} style={{ width: '100%', padding: 8, fontSize: 15, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input type="text" placeholder="Nombre*" value={nombre} onChange={e => setNombre(e.target.value)} style={{ width: '100%', padding: 8, fontSize: 15, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input type="text" placeholder="Departamento*" value={departamento} onChange={e => setDepartamento(e.target.value)} style={{ width: '100%', padding: 8, fontSize: 15, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input type="text" placeholder="Ruta/Máquina" value={ruta} onChange={e => setRuta(e.target.value)} style={{ width: '100%', padding: 8, fontSize: 15, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input type="text" placeholder="Tipo de usuario*" value={tipo} onChange={e => setTipo(e.target.value)} style={{ width: '100%', padding: 8, fontSize: 15, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        {mensaje && <div style={{ color: mensaje.includes('agregado') ? '#388e3c' : '#d32f2f', marginBottom: 12, textAlign: 'center' }}>{mensaje}</div>}
        <button type="submit" style={{ width: '100%', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 0', fontSize: 16, cursor: 'pointer' }}>
          Guardar
        </button>
      </form>
    </div>
  );
}
