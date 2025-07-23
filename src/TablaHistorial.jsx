import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsuario, getHistorial, limpiarGafete } from './db';

const columns = [
  'ID', 'FECHA', 'LINEA', 'LCODE', 'CIRCUITO', 'COLOR', 'MAQUINA', 'RUTA', 'DESTINO', 'VOLUMEN', 'MAX', 'MIN', 'PZAS', 'ESTATUS', 'GAFETE'
];

export default function TablaHistorial() {
  const navigate = useNavigate();
  const [historial, setHistorial] = useState([]);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  useEffect(() => {
    const gafete = localStorage.getItem('gafete');
    if (gafete) {
      getUsuario(limpiarGafete(gafete)).then(u => {
        setNombreUsuario(u?.NOMBRE || '');
        setUsuarioActivo(u);
      });
    }
  }, []);
  const handleIrMenu = () => {
    navigate('/menu-metodos');
  };
  const [filters, setFilters] = useState({});

  useEffect(() => {
    cargarHistorial();
  }, []);

  async function cargarHistorial() {
    const lista = await getHistorial();
    setHistorial(lista);
  }

  const handleFilterChange = (col, value) => {
    setFilters(f => ({ ...f, [col]: value }));
  };

  let filteredHistorial = historial;
  // Si es usuario de MATERIALES, filtrar por RUTA
  if (usuarioActivo && usuarioActivo.DEPARTAMENTO === 'MATERIALES') {
    filteredHistorial = filteredHistorial.filter(h => (h.RUTA_CORTE || h.RUTA || '').toUpperCase() === 'MATERIALES');
  }
  filteredHistorial = filteredHistorial.filter(h =>
    columns.every(col => {
      if (!filters[col]) return true;
      if (col === 'ID') return String(h.id || '').toLowerCase().includes(filters[col].toLowerCase());
      return String(h[col] || '').toLowerCase().includes(filters[col].toLowerCase());
    })
  );

  return (
    <div className="responsive-tabla-historial">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em'}}>
        <span style={{fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em'}}>
          Usuario: {nombreUsuario}
        </span>
        <div style={{display: 'flex', gap: '0.5em'}}>
          <button className="btn" style={{width: 120, background: '#1976d2'}} onClick={handleIrMenu}>Regresar al menú</button>

        </div>
      </div>
      <h2 style={{textAlign: 'center', color: '#1976d2', marginBottom: '1.5em'}}>Historial de Cambios</h2>
      <div style={{overflowX: 'auto'}}>
      <table className="admin-table" style={{minWidth: '1300px', tableLayout: 'fixed', wordBreak: 'break-word', fontSize: '12px'}}>
        <thead>
          <tr>
            {columns.map(col => <th key={col} style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{col}</th>)}
          </tr>
          <tr>
            {columns.map(col => (
              <th key={col} style={{padding: 0}}>
                <input
                  style={{
                    width: '100%',
                    fontSize: '0.95em',
                    boxSizing: 'border-box',
                    border: 'none',
                    outline: 'none',
                    padding: '0.4em 0.2em',
                    background: '#e3eafc',
                    height: '2em'
                  }}
                  placeholder={`Filtrar ${col}`}
                  value={filters[col] || ''}
                  onChange={e => handleFilterChange(col, e.target.value)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredHistorial.map(h => (
            <tr key={h.id}>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{h.id}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 180}}>{h.FECHA}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{h.LINEA}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{h.LCODE || ''}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{h.CIRCUITO || ''}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 100}}>{h.COLOR || ''}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{h.MAQUINA_CORTE || h.MAQUINA || ''}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{h.RUTA_CORTE || h.RUTA || ''}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{h.DESTINO || ''}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{h.VOLUMEN_DIARIO || h.VOLUMEN || ''}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', width: 55, maxWidth: 55, textAlign: 'center'}}>{h.MAXIMO || h.MAX || ''}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', width: 55, maxWidth: 55, textAlign: 'center'}}>{h.MINIMO || h.MIN || ''}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', width: 55, maxWidth: 55, textAlign: 'center'}}>{h.PIEZAS_RESTANTES || h.PZAS}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{h.ESTATUS}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{h.GAFETE || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
