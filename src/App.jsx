
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { addDisparo, addHistorial, getCable, getUsuario, limpiarGafete, getDisparos } from './db';
import { Link } from 'react-router-dom';


const lineas = [
  { id: 'L1', nombre: 'Línea 1' },
  { id: 'L2', nombre: 'Línea 2' },
  { id: 'L3', nombre: 'Línea 3' },
];

function App() {
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
    // Redirigir a login si no hay sesión
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

  // Buscar información real del cable en la base de datos
  const buscarInfoCable = async (codigo) => {
    if (!codigo) return null;
    // Elimina el prefijo hasta el primer guion, si existe
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
    // Cambia el foco al input del LCODE
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

  const handleCerrarSesion = () => {
    localStorage.removeItem('gafete');
    navigate('/login', { replace: true });
  };

  const handleRegistrar = async () => {
    const gafete = localStorage.getItem('gafete') || '';
    // Validar duplicado
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
    <div className="container responsive-critico">
      <div className="header-critico">
        <span className="usuario-critico">Usuario: {nombreUsuario}</span>
        <div style={{display: 'flex', gap: '0.5em'}}>
          <button className="btn menu-btn" onClick={handleIrMenu}>Regresar al menú</button>
        </div>
      </div>
      <h1 className="titulo-critico">RYC DISPARO DE CRITICO</h1>
      <h2 className="subtitulo-critico">Disparo de Cable Crítico</h2>
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
      >
        Registrar disparo
      </button>
      {avisoEnviado && <div className="aviso-exito">¡Aviso registrado!</div>}
    </div>
  );
}

export default App;
