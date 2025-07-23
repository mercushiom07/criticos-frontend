import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDisparo, addHistorial, getCable, getUsuario, limpiarGafete, getDisparos } from './db';

const lineas = [
  { id: 'L1', nombre: 'Línea 1' },
  { id: 'L2', nombre: 'Línea 2' },
  { id: 'L3', nombre: 'Línea 3' },
];

export default function DisparoCritico() {
  const navigate = useNavigate();
  const [linea, setLinea] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const selectLineaRef = useRef(null);
  const lcodeInputRef = useRef(null);
  const cantidadInputRef = useRef(null);
  useEffect(() => {
    if (selectLineaRef.current) {
      selectLineaRef.current.focus();
    }
    const gafete = localStorage.getItem('gafete');
    if (gafete) {
      getUsuario(limpiarGafete(gafete)).then(u => setNombreUsuario(u?.NOMBRE || ''));
    }
  }, [navigate]);
  const handleIrMenu = () => {
    navigate('/menu-metodos');
  };
  const [lcode, setLcode] = useState('');
  const [infoCable, setInfoCable] = useState(null);
  const [piezasRestantes, setPiezasRestantes] = useState('');
  const [avisoEnviado, setAvisoEnviado] = useState(false);

  const buscarInfoCable = async (codigo) => {
    if (!codigo) return null;
    const lcodeSinPrefijo = codigo.includes('-') ? codigo.split('-')[1] : codigo;
    const cable = await getCable(lcodeSinPrefijo);
    if (!cable) return null;
    return {
      lcode: cable.LCODE,
      circuito: cable.CIRCUITO,
      color: cable.COLOR,
      maquinaCorte: cable.MAQUINA_CORTE,
      rutaCorte: cable.RUTA_CORTE,
      destino: cable.DESTINO,
      linea: linea,
      volumenDiario: cable.VOLUMEN_DIARIO,
      maximo: cable.MAXIMO,
      minimo: cable.MINIMO
    };
  };

  const handleLineaChange = (e) => {
    setLinea(e.target.value);
    setLcode('');
    setInfoCable(null);
    setPiezasRestantes('');
    setTimeout(() => {
      if (lcodeInputRef.current) {
        lcodeInputRef.current.focus();
      }
    }, 100);
  };

  const handleScanLcode = async (e) => {
    const value = e.target.value;
    setLcode(value);
    const info = await buscarInfoCable(value);
    setInfoCable(info);
    if (info && cantidadInputRef.current) {
      setTimeout(() => cantidadInputRef.current.focus(), 100);
    }
  };

  const handleRegistrar = async () => {
    const gafete = localStorage.getItem('gafete') || '';
    const disparos = await getDisparos();
    const existe = disparos.some(d => (d.LCODE || '').toUpperCase() === (infoCable.lcode || '').toUpperCase() && (d.LINEA || '').toUpperCase() === (linea || '').toUpperCase());
    if (existe) {
      alert('Este LCODE ya está disparado en esta línea.');
      return;
    }
    const disparo = {
      LINEA: linea,
      PIEZAS_RESTANTES: Number(piezasRestantes),
      FECHA: new Date().toLocaleString(),
      LCODE: infoCable.lcode,
      CIRCUITO: infoCable.circuito,
      COLOR: infoCable.color,
      MAQUINA_CORTE: infoCable.maquinaCorte,
      RUTA_CORTE: infoCable.rutaCorte,
      DESTINO: infoCable.destino,
      VOLUMEN_DIARIO: infoCable.volumenDiario,
      MAXIMO: infoCable.maximo,
      MINIMO: infoCable.minimo,
      ESTATUS: 'CRITICO'
    };
    await addDisparo(disparo);
    await addHistorial({
      ...disparo,
      ESTATUS: 'CRITICO',
      GAFETE: gafete,
      FECHA: new Date().toLocaleString()
    });
    setAvisoEnviado(true);
    setTimeout(() => setAvisoEnviado(false), 3000);
    setLinea('');
    setLcode('');
    setInfoCable(null);
    setPiezasRestantes('');
    if (selectLineaRef.current) selectLineaRef.current.focus();
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
        <div style={{width: '100%', marginBottom: '1.5em', display: 'flex', justifyContent: 'flex-start'}}>
          <span className="usuario-critico" style={{fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em'}}>
            Usuario: {nombreUsuario}
          </span>
        </div>
        <h1 className="titulo-critico" style={{textAlign: 'center', color: '#1976d2', marginBottom: '1.2em', fontSize: '1.7em', fontWeight: 700}}>RYC DISPARO DE CRITICO</h1>
        <h2 className="subtitulo-critico" style={{textAlign: 'center', color: '#333', fontSize: '1.1em', marginBottom: '1.5em'}}>Disparo de Cable Crítico</h2>
        <div className="form-group">
          <div className="etiqueta-campo">LINEA:</div>
          <label>Escanea el QR o escribe la línea:</label>
          <input
            ref={selectLineaRef}
            type="text"
            value={linea}
            onChange={handleLineaChange}
            placeholder="Escanea o escribe la línea"
          />
          <p className="ayuda-critico">Escanea el QR para capturar la línea o escríbela manualmente</p>
        </div>
        <div className="form-group">
          <div className="etiqueta-campo">LCODE:</div>
          <label>Escanea el código de barras del LCODE:</label>
          <input
            ref={lcodeInputRef}
            type="text"
            value={lcode}
            onChange={handleScanLcode}
            placeholder="Escanea o escribe el LCODE"
            disabled={!linea}
          />
        </div>
        {infoCable && (
          <>
            <div className="etiqueta-campo">INFORMACIÓN:</div>
            <form className="info-cable">
              <div><strong>LCODE:</strong> {infoCable.lcode}</div>
              <div><strong>CIRCUITO:</strong> {infoCable.circuito}</div>
              <div><strong>COLOR:</strong> {infoCable.color}</div>
              <div><strong>MAQUINA DE CORTE:</strong> {infoCable.maquinaCorte}</div>
              <div><strong>RUTA DE CORTE:</strong> {infoCable.rutaCorte}</div>
              <div><strong>DESTINO:</strong> {infoCable.destino}</div>
              <div><strong>LINEA:</strong> {infoCable.linea}</div>
              <div><strong>VOLUMEN DIARIO:</strong> {infoCable.volumenDiario}</div>
              <div><strong>MÁXIMO:</strong> {infoCable.maximo}</div>
              <div><strong>MÍNIMO:</strong> {infoCable.minimo}</div>
            </form>
          </>
        )}
        <div className="form-group">
          <div className="etiqueta-campo">CANTIDAD:</div>
          <label>Piezas restantes en el punto de uso:</label>
          <input
            ref={cantidadInputRef}
            type="number"
            min="0"
            value={piezasRestantes}
            onChange={e => setPiezasRestantes(e.target.value)}
            placeholder="Cantidad"
          />
        </div>
        <button
          className="btn registrar-btn"
          onClick={handleRegistrar}
          disabled={!linea || !lcode || !piezasRestantes}
          style={{marginBottom: '1em'}}
        >
          Registrar disparo
        </button>
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
            marginBottom: '0.5em',
          }}
        >
          Regresar al menú
        </button>
        {avisoEnviado && <div className="aviso-exito">¡Aviso registrado!</div>}
      </div>
    </div>
  );
}
