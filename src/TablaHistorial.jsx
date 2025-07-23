import { useEffect, useState } from 'react';
import { getHistorial } from './db';

const columns = [
  'ID', 'GAFETE', 'NOMBRE', 'LINEA', 'LCODE', 'CIRCUITO', 'COLOR', 'MAQUINA', 'RUTA', 'DESTINO', 'VOLUMEN', 'MAX', 'MIN', 'PZAS', 'FECHA', 'ESTATUS'
];

export default function TablaHistorial() {
  const [historial, setHistorial] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    cargarHistorial();
  }, []);

  async function cargarHistorial() {
    const lista = await getHistorial();
    setHistorial(lista);
  }

  const historialFiltrado = historial.filter(h =>
    columns.some(col => (h[col] || '').toString().toLowerCase().includes(filtro.toLowerCase()))
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: 0 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>Historial</h2>
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Filtrar historial"
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            style={{ width: 300, padding: 8, fontSize: 14, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', background: '#fff', fontSize: 13 }}>
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col} style={{ border: '1px solid #ccc', padding: 4 }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historialFiltrado.map(h => (
                <tr key={h.ID || h.id}>
                  {columns.map(col => (
                    <td key={col} style={{ border: '1px solid #ccc', padding: 4 }}>{h[col] || h[col.toUpperCase()] || h[col.toLowerCase()] || ''}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
