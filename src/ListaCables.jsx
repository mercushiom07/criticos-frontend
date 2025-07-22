import { useEffect, useState } from 'react';
import { getCables } from './db';

const columns = [
  'LCODE', 'CIRCUITO', 'COLOR', 'MAQUINA_CORTE', 'RUTA_CORTE', 'DESTINO', 'LINEA', 'VOLUMEN_DIARIO', 'MINIMO', 'MAXIMO', 'TIPO'
];

function exportToCSV(data, columns) {
  const header = columns.join(',');
  const rows = data.map(row => columns.map(col => `"${row[col] ?? ''}"`).join(','));
  const csvContent = [header, ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  const filename = `cables_export_${dateStr}.csv`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function ListaCables({ tableClass, refreshKey }) {
  const [cables, setCables] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    getCables().then(setCables);
  }, [refreshKey]);

  const handleFilterChange = (col, value) => {
    setFilters(f => ({ ...f, [col]: value }));
  };

  const filteredCables = cables.filter(cable =>
    columns.every(col => {
      if (!filters[col]) return true;
      return String(cable[col] || '').toLowerCase().includes(filters[col].toLowerCase());
    })
  );

  return (
    <div>
      <h3>Lista de Cables</h3>
      <button style={{marginBottom: '1em'}} onClick={() => exportToCSV(filteredCables, columns)}>
        Exportar filtrados a CSV
      </button>
      <table className={tableClass || ''}>
        <thead>
          <tr>
            {columns.map(col => <th key={col}>{col}</th>)}
          </tr>
          <tr>
            {columns.map(col => (
              <th key={col}>
                <input
                  type="text"
                  value={filters[col] || ''}
                  onChange={e => handleFilterChange(col, e.target.value)}
                  placeholder={`Filtrar ${col}`}
                  style={{width: '100%', boxSizing: 'border-box'}}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredCables.map(cable => (
            <tr key={cable.LCODE}>
              {columns.map(col => <td key={col}>{cable[col]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaCables;
