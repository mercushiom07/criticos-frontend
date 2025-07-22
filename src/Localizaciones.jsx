  const handleIrMenu = () => {
    window.location.href = '/menu-metodos';
  };
import { useState, useRef } from 'react';
import './App.css';
import { getCable } from './db';

function Localizaciones() {
  const [modo, setModo] = useState('BARRAS'); // 'BARRAS' o 'QR'
  const [inputValor, setInputValor] = useState('');
  const [infoCable, setInfoCable] = useState(null);
  const inputRef = useRef(null);

  const handleToggle = (nuevoModo) => {
    setModo(nuevoModo);
    setInputValor('');
    setInfoCable(null);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 100);
  };

  const handleInputChange = async (e) => {
    let valor = e.target.value;
    setInputValor(valor);
    if (!valor) {
      setInfoCable(null);
      return;
    }
    if (modo === 'BARRAS') {
      // Elimina prefijo hasta el primer guion, si existe
      const lcodeSinPrefijo = valor.includes('-') ? valor.split('-')[1] : valor;
      const cable = await getCable(lcodeSinPrefijo);
      setInfoCable(cable || null);
    } else {
      // Buscar por DESTINO (primero que coincida, ignorando mayúsculas/minúsculas)
      const cables = await (await import('./db')).getCables();
      const cable = cables.find(c => (c.DESTINO || '').toLowerCase() === valor.toLowerCase());
      setInfoCable(cable || null);
    }
  };

  return (
    <div className="container">
      <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1em'}}>
        <button className="btn" style={{width: 180, background: '#1976d2'}} onClick={handleIrMenu}>Regresar al menú</button>
      </div>
      <h1 style={{textAlign: 'center', color: '#1976d2', marginBottom: '1.5em'}}>LOCALIZACIONES</h1>
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1.5em'}}>
        <button
          className={modo === 'BARRAS' ? 'btn btn-toggle-active' : 'btn btn-toggle'}
          style={{marginRight: 8}}
          onClick={() => handleToggle('BARRAS')}
        >
          BARRAS
        </button>
        <button
          className={modo === 'QR' ? 'btn btn-toggle-active' : 'btn btn-toggle'}
          onClick={() => handleToggle('QR')}
        >
          QR
        </button>
      </div>
      <div className="form-group">
        <label>{modo === 'BARRAS' ? 'Escanea o ingresa el LCODE:' : 'Escanea o ingresa el DESTINO:'}</label>
        <input
          ref={inputRef}
          type="text"
          value={inputValor}
          onChange={handleInputChange}
          placeholder={modo === 'BARRAS' ? 'LCODE' : 'DESTINO'}
        />
      </div>
      {infoCable && (
        <form className="info-cable" style={{marginTop: '1.5em'}}>
          <div><strong>LCODE:</strong> {infoCable.LCODE}</div>
          <div><strong>CIRCUITO:</strong> {infoCable.CIRCUITO}</div>
          <div><strong>COLOR:</strong> {infoCable.COLOR}</div>
          <div><strong>MAQUINA DE CORTE:</strong> {infoCable.MAQUINA_CORTE}</div>
          <div><strong>RUTA DE CORTE:</strong> {infoCable.RUTA_CORTE}</div>
          <div><strong>DESTINO:</strong> {infoCable.DESTINO}</div>
          <div><strong>LINEA:</strong> {infoCable.LINEA}</div>
          <div><strong>VOLUMEN DIARIO:</strong> {infoCable.VOLUMEN_DIARIO}</div>
          <div><strong>MÁXIMO:</strong> {infoCable.MAXIMO}</div>
          <div><strong>MÍNIMO:</strong> {infoCable.MINIMO}</div>
        </form>
      )}
    </div>
  );
}

export default Localizaciones;
