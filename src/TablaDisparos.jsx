import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDisparos, addHistorial, getUsuario, updateDisparo, deleteDisparo, limpiarGafete } from './db';

const ESTATUS_OPCIONES = ['CRITICO', 'EN PROCESO', 'CORTADO', 'SURTIDO', 'BAJO VOLUMEN'];
const columns = [
  'ID', 'LINEA', 'LCODE', 'CIRCUITO', 'COLOR', 'MAQUINA', 'RUTA', 'DESTINO', 'VOLUMEN', 'MAX', 'MIN', 'PZAS', 'FECHA', 'ESTATUS'
];

export default function TablaDisparos() {
  const [disparos, setDisparos] = useState([]);
  const [filters, setFilters] = useState({});
  const [selected, setSelected] = useState([]);
  const [estatusNuevo, setEstatusNuevo] = useState('CRITICO');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarDisparos();
    // Obtener nombre y datos del usuario activo
    const gafete = localStorage.getItem('gafete');
    if (gafete) {
      getUsuario(limpiarGafete(gafete)).then(u => {
        setNombreUsuario(u?.NOMBRE || '');
        setUsuarioActivo(u);
      });
    }
  }, []);

  async function cargarDisparos() {
    const lista = await getDisparos();
    setDisparos(lista);
  }

  const handleIrMenu = () => {
    navigate('/menu-metodos');
  };

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
    const gafeteActivo = limpiarGafete(localStorage.getItem('gafete') || '');
    await Promise.all(selected.map(async (id) => {
      const disparo = disparos.find(d => d.id === id);
      if (disparo) {
        if (estatusNuevo === 'SURTIDO') {
          await addHistorial({ ...disparo, ESTATUS: 'SURTIDO', GAFETE: gafeteActivo, FECHA: new Date().toLocaleString() });
        }
        await updateDisparo(id, { ...disparo, ESTATUS: estatusNuevo });
      }
    }));
    setSelected([]);
    setEstatusNuevo('CRITICO');
    cargarDisparos();
  }

  async function handleEditar(d) {
    alert('Función de edición no implementada');
  }

  async function handleEliminar(id) {
    await deleteDisparo(id);
    cargarDisparos();
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: 0, position: 'relative' }}>
      <div style={{ position: 'absolute', top: 16, right: 32, zIndex: 10 }}>
        <button onClick={handleIrMenu} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', fontSize: 15, cursor: 'pointer' }}>
          Regresar al menú
        </button>
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontWeight: 'bold', color: '#1976d2' }}>Usuario: {nombreUsuario}</span>
        </div>
        <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>Tabla de Disparos</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 1200, background: '#fff', fontSize: 13 }}>
            <thead>
              <tr>
                <th><input type="checkbox" checked={selected.length === filteredDisparos.length && filteredDisparos.length > 0} onChange={e => handleSelectAll(e.target.checked)} /></th>
                {columns.map(col => <th key={col} style={{ border: '1px solid #ccc', padding: 4 }}>{col}</th>)}
                <th>Acciones</th>
              </tr>
              <tr>
                <th></th>
                {columns.map(col => (
                  <th key={col} style={{ padding: 0 }}>
                    <input
                      style={{ width: '100%', fontSize: 12, boxSizing: 'border-box', height: 24 }}
                      placeholder={`Filtrar ${col}`}
                      value={filters[col] || ''}
                      onChange={e => handleFilterChange(col, e.target.value)}
                    />
                  </th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredDisparos.map(d => (
                <tr key={d.id}>
                  <td><input type="checkbox" checked={selected.includes(d.id)} onChange={() => handleSelect(d.id)} /></td>
                  {columns.map(col => (
                    <td key={col} style={{ border: '1px solid #ccc', padding: 4 }}>
                      {
                        col === 'ID' ? d.id :
                        col === 'LINEA' ? d.LINEA :
                        col === 'LCODE' ? d.LCODE :
                        col === 'CIRCUITO' ? d.CIRCUITO :
                        col === 'COLOR' ? d.COLOR :
                        col === 'MAQUINA' ? d.MAQUINA_CORTE || d.MAQUINA :
                        col === 'RUTA' ? d.RUTA_CORTE || d.RUTA :
                        col === 'DESTINO' ? d.DESTINO :
                        col === 'VOLUMEN' ? d.VOLUMEN_DIARIO || d.VOLUMEN :
                        col === 'MAX' ? d.MAXIMO || d.MAX :
                        col === 'MIN' ? d.MINIMO || d.MIN :
                        col === 'PZAS' ? d.PIEZAS_RESTANTES || d.PZAS :
                        col === 'FECHA' ? d.FECHA :
                        col === 'ESTATUS' ? d.ESTATUS :
                        d[col] || d[col.toUpperCase()] || d[col.toLowerCase()] || ''
                      }
                    </td>
                  ))}
                  <td>
                    <button style={{ marginRight: 8, background: '#ffc107', color: '#333', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }} onClick={() => handleEditar(d)}>Editar</button>
                    <button style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }} onClick={() => handleEliminar(d.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 16 }}>
          <button style={{ marginRight: 8, background: '#388e3c', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer' }} onClick={handleExportar}>Exportar CSV</button>
          <select style={{ marginRight: 8, padding: '6px 12px', fontSize: 14 }} value={estatusNuevo} onChange={e => setEstatusNuevo(e.target.value)}>
            {ESTATUS_OPCIONES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <button style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer' }} onClick={handleCambiarEstatus} disabled={selected.length === 0}>Cambiar estatus</button>
        </div>
      </div>
    </div>
  );
}
