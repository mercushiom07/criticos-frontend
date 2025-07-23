import { useEffect, useState } from 'react';
import { getCables, addCable, deleteCable } from './db';

export default function AdminCables() {
  const [cables, setCables] = useState([]);
  const [nuevo, setNuevo] = useState({ LCODE: '', LINEA: '', CIRCUITO: '', COLOR: '', MAQUINA_CORTE: '', RUTA_CORTE: '', DESTINO: '', VOLUMEN_DIARIO: '', MAXIMO: '', MINIMO: '' });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarCables();
  }, []);

  async function cargarCables() {
    const lista = await getCables();
    setCables(lista);
  }

  async function handleAgregar(e) {
    e.preventDefault();
    setMensaje('');
    if (!nuevo.LCODE || !nuevo.LINEA) {
      setMensaje('LCODE y LINEA son obligatorios');
      return;
    }
    await addCable(nuevo);
    setMensaje('Cable agregado');
    setNuevo({ LCODE: '', LINEA: '', CIRCUITO: '', COLOR: '', MAQUINA_CORTE: '', RUTA_CORTE: '', DESTINO: '', VOLUMEN_DIARIO: '', MAXIMO: '', MINIMO: '' });
    cargarCables();
  }

  async function handleEliminar(lcode) {
    await deleteCable(lcode);
    cargarCables();
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: 0 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>Administración de Cables</h2>
        {/* Formulario de alta eliminado */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', background: '#fff', fontSize: 13 }}>
            <thead>
              <tr>
                {Object.keys(nuevo).map(key => (
                  <th key={key} style={{ border: '1px solid #ccc', padding: 4 }}>{key}</th>
                ))}
                {/* <th style={{ border: '1px solid #ccc', padding: 4 }}>Acciones</th> */}
              </tr>
            </thead>
            <tbody>
              {cables.map(c => (
                <tr key={c.LCODE}>
                  {Object.keys(nuevo).map(key => (
                    <td key={key} style={{ border: '1px solid #ccc', padding: 4 }}>{c[key]}</td>
                  ))}
                  {/* <td style={{ border: '1px solid #ccc', padding: 4 }}>
                    <button style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }} onClick={() => handleEliminar(c.LCODE)}>Eliminar</button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
