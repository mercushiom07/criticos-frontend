import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsuario } from './db';


export default function Login() {
  const [gafeteScan, setGafeteScan] = useState('');
  const [error, setError] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const match = gafeteScan.match(/CF(\d+)/);
    if (!match) {
      setError('Formato de código incorrecto.');
      return;
    }
    const gafeteNum = match[1];
    const usuario = await getUsuario(gafeteNum);
    console.log('Usuario encontrado:', usuario);
    if (!usuario) {
      setError('Usuario no encontrado.');
      return;
    }
    setError('');
    // Guardar gafete en localStorage
    localStorage.setItem('gafete', usuario.GAFETE);
    navigate('/menu-metodos');
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstall(false);
      }
    }
  };

  return (
    <div className="container responsive-login">
      <h1 style={{textAlign: 'center', color: '#1976d2', marginBottom: '1.5em'}}>Inicio de sesión</h1>
      {showInstall && (
        <button className="btn btn-login" style={{background:'#388e3c', marginBottom:'1em'}} onClick={handleInstallClick}>
          Instalar aplicación
        </button>
      )}
      <form className="form-login" onSubmit={handleLogin}>
        <label htmlFor="gafete" className="label-login">Escanea el código de barras del gafete:</label>
        <input
          id="gafete"
          type="text"
          value={gafeteScan}
          onChange={e => setGafeteScan(e.target.value)}
          autoFocus
          className="input-login"
          placeholder="Escanea o escribe tu gafete"
        />
        <button type="submit" className="btn btn-login">Ingresar</button>
        {error && <div className="error-login">{error}</div>}
      </form>
    </div>
  );
}
