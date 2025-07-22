import React, { useState } from 'react';
import Papa from 'papaparse';
import { addCable, addUsuario } from './db';

const REQUIRED_CABLE_FIELDS = [
  'LCODE', 'CIRCUITO', 'COLOR', 'MAQUINA_CORTE', 'RUTA_CORTE', 'DESTINO', 'LINEA', 'VOLUMEN_DIARIO', 'MINIMO', 'MAXIMO', 'TIPO'
];

export default function ImportCSV({ onImport }) {
  const [table, setTable] = useState('cables');
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState([]);

  const validateRow = (row, fields) => {
    const missing = fields.filter(f => !(f in row) || row[f] === '');
    return missing.length === 0 ? null : missing;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        let count = 0;
        let errorRows = [];
        for (const [i, row] of results.data.entries()) {
          if (table === 'cables') {
            const missing = validateRow(row, REQUIRED_CABLE_FIELDS);
            if (missing) {
              errorRows.push(`Fila ${i + 2}: faltan campos ${missing.join(', ')}`);
              continue;
            }
            await addCable(row);
            count++;
          }
          if (table === 'usuarios') {
            await addUsuario(row);
            count++;
          }
        }
        setStatus(`Registros importados: ${count}`);
        setErrors(errorRows);
        if (typeof onImport === 'function') onImport();
      },
      error: () => setStatus('Error al procesar el archivo'),
    });
  };

  return (
    <div className="import-csv">
      <h3>Importar registros desde CSV</h3>
      <label>Selecciona la tabla:</label>
      <select value={table} onChange={e => setTable(e.target.value)}>
        <option value="cables">Cables</option>
        <option value="usuarios">Usuarios</option>
      </select>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {status && <div className="status">{status}</div>}
      {errors.length > 0 && (
        <div style={{color: 'red', marginTop: '1em'}}>
          <strong>Errores de importación:</strong>
          <ul>
            {errors.map((err, idx) => <li key={idx}>{err}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
