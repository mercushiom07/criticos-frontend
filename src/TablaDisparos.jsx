
  // Exportar a CSV
  const handleExportar = () => {
    if (!filteredDisparos || !filteredDisparos.length) return;
    const csvRows = [];
    csvRows.push(columns.join(','));
    filteredDisparos.forEach(d => {
      const row = columns.map(col => {
        let val = '';
        switch (col) {
          case 'ID': val = d.id || ''; break;
          case 'LINEA': val = d.LINEA || ''; break;
          case 'LCODE': val = d.LCODE || ''; break;
          case 'CIRCUITO': val = d.CIRCUITO || ''; break;
          case 'COLOR': val = d.COLOR || ''; break;
          case 'MAQUINA': val = d.MAQUINA_CORTE || d.MAQUINA || ''; break;
          case 'RUTA': val = d.RUTA_CORTE || d.RUTA || ''; break;
          case 'DESTINO': val = d.DESTINO || ''; break;
          case 'VOLUMEN': val = d.VOLUMEN_DIARIO || d.VOLUMEN || ''; break;
          case 'MAX': val = d.MAXIMO || d.MAX || ''; break;
          case 'MIN': val = d.MINIMO || d.MIN || ''; break;
          case 'PZAS': val = d.PIEZAS_RESTANTES || d.PZAS || ''; break;
          case 'FECHA': val = d.FECHA || ''; break;
          case 'ESTATUS': val = d.ESTATUS || ''; break;
          default: val = d[col] || d[col.toUpperCase()] || d[col.toLowerCase()] || ''; break;
        }
        return '"' + String(val).replace(/"/g, '""') + '"';
      });
      csvRows.push(row.join(','));
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    // Personalizar nombre del archivo
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const fecha = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}`;
    const hora = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const filename = `CRITICOS-${fecha}-${hora}.csv`;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
import React, { useEffect, useState } from 'react';
import { getDisparos, addHistorial, getUsuario } from './db';
const ESTATUS_OPCIONES = ['CRITICO', 'EN PROCESO', 'CORTADO', 'SURTIDO', 'BAJO VOLUMEN'];

const columns = [
  'ID', 'LINEA', 'LCODE', 'CIRCUITO', 'COLOR', 'MAQUINA', 'RUTA', 'DESTINO', 'VOLUMEN', 'MAX', 'MIN', 'PZAS', 'FECHA', 'ESTATUS'
];

export default function TablaDisparos() {
  const [disparos, setDisparos] = useState([]);
  const [filters, setFilters] = useState({});
  const [selected, setSelected] = useState([]);
  const [estatusNuevo, setEstatusNuevo] = useState('CRITICO');
  const [gafeteCambio, setGafeteCambio] = useState(() => localStorage.getItem('gafete') || '');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  useEffect(() => {
    cargarDisparos();
    // Obtener nombre y datos del usuario activo
    const gafete = localStorage.getItem('gafete');
    if (gafete) {
      getUsuario(gafete).then(u => {
        setNombreUsuario(u?.NOMBRE || '');
        setUsuarioActivo(u);
      });
    }
  }, []);

  async function cargarDisparos() {
    const lista = await getDisparos();
    setDisparos(lista);
  }

  const handleFilterChange = (col, value) => {
    setFilters(f => ({ ...f, [col]: value }));
  };


  let filteredDisparos = disparos;
  // Si es usuario de MATERIALES, filtrar por RUTA
  if (usuarioActivo && usuarioActivo.DEPARTAMENTO === 'MATERIALES') {
    filteredDisparos = filteredDisparos.filter(d => (d.RUTA_CORTE || d.RUTA || '').toUpperCase() === 'MATERIALES');
  }
  filteredDisparos = filteredDisparos.filter(d =>
    columns.every(col => {
      if (!filters[col]) return true;
      // ID es d.id, los demás son d[col]
      if (col === 'ID') return String(d.id || '').toLowerCase().includes(filters[col].toLowerCase());
      return String(d[col] || '').toLowerCase().includes(filters[col].toLowerCase());
    })
  );

  // Exportar a CSV (única función)
  const handleExportar = () => {
    if (!filteredDisparos || !filteredDisparos.length) return;
    const csvRows = [];
    csvRows.push(columns.join(','));
    filteredDisparos.forEach(d => {
      const row = columns.map(col => {
        let val = '';
        switch (col) {
          case 'ID': val = d.id || ''; break;
          case 'LINEA': val = d.LINEA || ''; break;
          case 'LCODE': val = d.LCODE || ''; break;
          case 'CIRCUITO': val = d.CIRCUITO || ''; break;
          case 'COLOR': val = d.COLOR || ''; break;
          case 'MAQUINA': val = d.MAQUINA_CORTE || d.MAQUINA || ''; break;
          case 'RUTA': val = d.RUTA_CORTE || d.RUTA || ''; break;
          case 'DESTINO': val = d.DESTINO || ''; break;
          case 'VOLUMEN': val = d.VOLUMEN_DIARIO || d.VOLUMEN || ''; break;
          case 'MAX': val = d.MAXIMO || d.MAX || ''; break;
          case 'MIN': val = d.MINIMO || d.MIN || ''; break;
          case 'PZAS': val = d.PIEZAS_RESTANTES || d.PZAS || ''; break;
          case 'FECHA': val = d.FECHA || ''; break;
          case 'ESTATUS': val = d.ESTATUS || ''; break;
          default: val = d[col] || d[col.toUpperCase()] || d[col.toLowerCase()] || ''; break;
        }
        return '"' + String(val).replace(/"/g, '""') + '"';
      });
      csvRows.push(row.join(','));
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    // Personalizar nombre del archivo
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const fecha = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}`;
    const hora = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const filename = `CRITICOS-${fecha}-${hora}.csv`;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSelect = (id) => {
    setSelected(sel => sel.includes(id) ? sel.filter(s => s !== id) : [...sel, id]);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelected(filteredDisparos.map(d => d.id));
    } else {
      setSelected([]);
    }
  };

  async function handleCambiarEstatus() {
    if (!estatusNuevo || selected.length === 0) return;
    // Actualizar estatus en disparos y agregar a historial usando el usuario activo
    const db = await import('./db');
    const dbInstance = await db.dbPromise;
    const gafeteActivo = localStorage.getItem('gafete') || '';
    await Promise.all(selected.map(async (id) => {
      const disparo = await dbInstance.get('disparos', id);
      if (disparo) {
        if (estatusNuevo === 'SURTIDO') {
          // Eliminar de disparos
          await dbInstance.delete('disparos', id);
        } else {
          // Actualizar estatus
          const nuevo = { ...disparo, ESTATUS: estatusNuevo };
          await dbInstance.put('disparos', nuevo);
        }
        // Agregar al historial (sin id)
        const { id: _, ...historialData } = { ...disparo, ESTATUS: estatusNuevo };
        await dbInstance.add('historial', {
          ...historialData,
          FECHA: new Date().toLocaleString(),
          GAFETE: gafeteActivo
        });
      }
    }));
    setSelected([]);
    setGafeteCambio('');
    await cargarDisparos();
    alert('Estatus actualizado y cambios registrados en historial.');
  }

  const handleIrMenu = () => {
    window.location.href = '/menu-metodos';
  };

  return (
    <div className="container" style={{minWidth: '1360px', minHeight: '720px', padding: '2em', overflowX: 'auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em'}}>
        <span style={{fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em'}}>
          Usuario: {nombreUsuario || gafeteCambio}
        </span>
        <button className="btn" style={{width: 180, background: '#1976d2'}} onClick={handleIrMenu}>Regresar al menú</button>
      </div>
      <h2 style={{textAlign: 'center', color: '#1976d2', marginBottom: '1.5em'}}>Registros de Disparos</h2>
      <div style={{marginBottom: '1em', display: 'flex', gap: '1em', alignItems: 'center'}}>
        <label><b>Cambiar estatus a:</b></label>
        <select value={estatusNuevo} onChange={e => setEstatusNuevo(e.target.value)}>
          {ESTATUS_OPCIONES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <button className="btn" style={{width: 180}} onClick={handleCambiarEstatus} disabled={selected.length === 0 || !gafeteCambio}>
          Cambiar estatus
        </button>
        <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
          <button className="btn" style={{width: 180, background: '#388e3c'}} onClick={handleExportar}>
            Exportar tabla
          </button>
        </div>
      </div>
      <div style={{overflowX: 'auto'}}>
      <table className="admin-table" style={{minWidth: '1300px', tableLayout: 'fixed', wordBreak: 'break-word', fontSize: '12px'}}>
        <thead>
          <tr>
            <th>
              <input type="checkbox" checked={selected.length === filteredDisparos.length && filteredDisparos.length > 0} onChange={e => handleSelectAll(e.target.checked)} />
            </th>
            {columns.map(col => <th key={col} style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{col}</th>)}
          </tr>
          <tr>
            <th></th>
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
          {filteredDisparos.map(d => (
            <tr key={d.id} style={{background: selected.includes(d.id) ? '#e3eafc' : undefined}}>
              <td>
                <input type="checkbox" checked={selected.includes(d.id)} onChange={() => handleSelect(d.id)} />
              </td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{d.id}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{d.LINEA}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{d.LCODE || ''}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{d.CIRCUITO || ''}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 100}}>{d.COLOR || ''}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{d.MAQUINA_CORTE || d.MAQUINA || ''}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{d.RUTA_CORTE || d.RUTA || ''}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{d.DESTINO || ''}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{d.VOLUMEN_DIARIO || d.VOLUMEN || ''}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', width: 55, maxWidth: 55, textAlign: 'center'}}>{d.MAXIMO || d.MAX || ''}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', width: 55, maxWidth: 55, textAlign: 'center'}}>{d.MINIMO || d.MIN || ''}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', width: 55, maxWidth: 55, textAlign: 'center'}}>{d.PIEZAS_RESTANTES || d.PZAS}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 180}}>{d.FECHA}</td>
              <td style={{whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 120}}>{d.ESTATUS}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
