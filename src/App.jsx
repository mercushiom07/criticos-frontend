
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
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card shadow p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold text-primary">Usuario: {nombreUsuario}</span>
              <button className="btn btn-secondary" onClick={handleIrMenu}>Regresar al menú</button>
            </div>
            <h1 className="text-center text-primary mb-2">RYC DISPARO DE CRITICO</h1>
            <h2 className="text-center text-secondary mb-4">Disparo de Cable Crítico</h2>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label">LÍNEA:</label>
                <input
                  ref={selectLineaRef}
                  type="text"
                  value={linea}
                  onChange={handleLineaChange}
                  placeholder="Escanea o escribe la línea"
                  className="form-control mb-2"
                />
                <div className="form-text mb-3">Escanea el QR para capturar la línea o escríbela manualmente</div>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">LCODE:</label>
                <input
                  ref={lcodeInputRef}
                  type="text"
                  value={lcode}
                  onChange={handleScanLcode}
                  placeholder="Escanea o escribe el LCODE"
                  className="form-control mb-2"
                  disabled={!linea}
                />
              </div>
              {infoCable && (
                <div className="col-12">
                  <div className="alert alert-info">
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
                  </div>
                </div>
              )}
              <div className="col-12 col-md-6">
                <label className="form-label">CANTIDAD:</label>
                <input
                  ref={cantidadInputRef}
                  type="number"
                  min="0"
                  value={piezasRestantes}
                  onChange={e => setPiezasRestantes(e.target.value)}
                  placeholder="Cantidad"
                  className="form-control mb-2"
                />
              </div>
              <div className="col-12 col-md-6 d-flex align-items-end">
                <button
                  className="btn btn-success w-100"
                  onClick={handleRegistrar}
                  disabled={!linea || !lcode || !piezasRestantes}
                >
                  Registrar disparo
                </button>
              </div>
              {avisoEnviado && (
                <div className="col-12">
                  <div className="alert alert-success text-center">¡Aviso registrado!</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
