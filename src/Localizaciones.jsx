// ...existing code...
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { getCable, getCables } from './db';

function Localizaciones() {
  const navigate = useNavigate();
  const handleIrMenu = () => {
    navigate('/menu-metodos');
  };
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
      const cables = await getCables();
      const cable = cables.find(c => (c.DESTINO || '').toLowerCase() === valor.toLowerCase());
      setInfoCable(cable || null);
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      minHeight: '720px',
      minWidth: '1280px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
      position: 'relative',
    }}>
      <div style={{
        width: '520px',
        minHeight: '480px',
        background: '#fff',
        borderRadius: '1.2em',
        boxShadow: '0 0 24px #b0c4e7',
        padding: '2.5em 2.5em 2em 2.5em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <h1 style={{textAlign: 'center', color: '#1976d2', marginBottom: '1.2em', fontSize: '1.7em', fontWeight: 700, letterSpacing: 2}}>LOCALIZACIONES</h1>
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '2em', gap: 16}}>
          <button
            className={modo === 'BARRAS' ? 'btn btn-toggle-active' : 'btn btn-toggle'}
            style={{minWidth: 140, fontSize: '1.1em', padding: '0.7em 1.5em'}}
            onClick={() => handleToggle('BARRAS')}
          >
            BARRAS
          </button>
          <button
            className={modo === 'QR' ? 'btn btn-toggle-active' : 'btn btn-toggle'}
            style={{minWidth: 140, fontSize: '1.1em', padding: '0.7em 1.5em'}}
            onClick={() => handleToggle('QR')}
          >
            QR
          </button>
        </div>
        <div className="form-group" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2em', width: '100%'}}>
          <label style={{fontSize: '1.1em', marginBottom: 8}}>{modo === 'BARRAS' ? 'Escanea o ingresa el LCODE:' : 'Escanea o ingresa el DESTINO:'}</label>
          <input
            ref={inputRef}
            type="text"
            value={inputValor}
            onChange={handleInputChange}
            placeholder={modo === 'BARRAS' ? 'LCODE' : 'DESTINO'}
            style={{
              width: '100%',
              maxWidth: 340,
              fontSize: '1.2em',
              padding: '0.7em 1em',
              border: '1.5px solid #1976d2',
              borderRadius: 8,
              outline: 'none',
              background: '#f5f8ff',
              marginBottom: 0
            }}
          />
        </div>
        {infoCable && (
          <form className="info-cable" style={{
            marginTop: '1.5em',
            background: '#f5f8ff',
            borderRadius: 12,
            padding: '2em 2.5em',
            boxShadow: '0 2px 12px 0 #0001',
            fontSize: '1.15em',
            maxWidth: 500,
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
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
        <button
          className="btn menu-btn"
          onClick={handleIrMenu}
          style={{
            width: '100%',
            background: '#1976d2',
            color: '#fff',
            fontSize: '1.1em',
            borderRadius: '0.5em',
            padding: '1em',
            marginTop: '2.5em',
            marginBottom: '0.5em',
          }}
        >
          Regresar al menú
        </button>
      </div>
    </div>
  );
}

export default Localizaciones;
