import ImportCSV from './ImportCSV';
import ListaCables from './ListaCables';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUsuario } from './db';

export default function AdminCables() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [nombreUsuario, setNombreUsuario] = useState('');
  useEffect(() => {
    const gafete = localStorage.getItem('gafete');
    if (gafete) {
      getUsuario(gafete).then(u => setNombreUsuario(u?.NOMBRE || ''));
    }
  }, []);
  const handleImport = () => setRefreshKey(k => k + 1);
  const handleIrMenu = () => {
    window.location.href = '/menu-metodos';
  };

  return (
    <div className="container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em'}}>
        <span style={{fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em'}}>
          Usuario: {nombreUsuario}
        </span>
        <button className="btn" style={{width: 180, background: '#1976d2'}} onClick={handleIrMenu}>Regresar al menú</button>
      </div>
      <nav style={{marginBottom: '1em', display: 'flex', justifyContent: 'space-between'}}>
        <Link to="/" style={{color: '#1976d2', fontWeight: 'bold'}}>Regresar a registro de disparos</Link>
      </nav>
      <h1 style={{textAlign: 'center', color: '#1976d2', marginBottom: '1.5em'}}>Administración de Cables</h1>
      <div className="import-csv">
        <ImportCSV onImport={handleImport} />
      </div>
      <div>
        <ListaCables tableClass="admin-table" refreshKey={refreshKey} style={{wordBreak: 'break-word', fontSize: '12px'}} columnsOverride={['ID', 'LINEA', 'LCODE', 'CIRCUITO', 'COLOR', 'MAQUINA', 'RUTA', 'DESTINO', 'VOLUMEN', 'MAX', 'MIN', 'PZAS']} />
      </div>
    </div>
  );
}
