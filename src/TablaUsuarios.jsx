import { useEffect, useState } from 'react';
import { getUsuarios, deleteUsuario } from './db';

export default function TablaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    const lista = await getUsuarios();
    setUsuarios(lista);
  }

  async function handleEliminar(gafete) {
    await deleteUsuario(gafete);
    cargarUsuarios();
  }

  const usuariosFiltrados = usuarios.filter(u =>
    u.NOMBRE.toLowerCase().includes(filtro.toLowerCase()) ||
    u.GAFETE.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: 0 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>Usuarios</h2>
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Filtrar por nombre o gafete"
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            style={{ width: 300, padding: 8, fontSize: 14, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', background: '#fff', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: 4 }}>Gafete</th>
                <th style={{ border: '1px solid #ccc', padding: 4 }}>Nombre</th>
                <th style={{ border: '1px solid #ccc', padding: 4 }}>Departamento</th>
                <th style={{ border: '1px solid #ccc', padding: 4 }}>Ruta/Máquina</th>
                <th style={{ border: '1px solid #ccc', padding: 4 }}>Tipo</th>
                <th style={{ border: '1px solid #ccc', padding: 4 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map(u => (
                <tr key={u.GAFETE}>
                  <td style={{ border: '1px solid #ccc', padding: 4 }}>{u.GAFETE}</td>
                  <td style={{ border: '1px solid #ccc', padding: 4 }}>{u.NOMBRE}</td>
                  <td style={{ border: '1px solid #ccc', padding: 4 }}>{u.DEPARTAMENTO}</td>
                  <td style={{ border: '1px solid #ccc', padding: 4 }}>{u.RUTA_MAQUINA}</td>
                  <td style={{ border: '1px solid #ccc', padding: 4 }}>{u.TIPO_USUARIO}</td>
                  <td style={{ border: '1px solid #ccc', padding: 4 }}>
                    <button style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }} onClick={() => handleEliminar(u.GAFETE)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
