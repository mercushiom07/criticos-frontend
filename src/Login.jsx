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
    <div style={{
      width: '100vw',
      height: '100vh',
      minHeight: '720px',
      minWidth: '1280px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
      backgroundColor: '#fff',
    }}>
      <div style={{
        width: '420px',
        minHeight: '420px',
        background: '#fff',
        borderRadius: '1.2em',
        boxShadow: '0 0 24px #b0c4e7',
        padding: '2.5em 2.5em 2em 2.5em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1em',
          width: '100%',
          marginBottom: '1.5em',
        }}>
          <img
            src="/icon-192x192.png"
            alt="Logo"
            style={{ width: 56, height: 56, borderRadius: '12px', boxShadow: '0 2px 8px #b0c4e7' }}
          />
          <h1 style={{
            color: '#1976d2',
            fontSize: '2.2em',
            fontWeight: 700,
            margin: 0,
            textAlign: 'left',
            lineHeight: 1.1,
          }}>Inicio de sesión</h1>
        </div>
        {showInstall && (
          <button className="btn btn-login" style={{background:'#388e3c', marginBottom:'1em'}} onClick={handleInstallClick}>
            Instalar aplicación
          </button>
        )}
        <form className="form-login" onSubmit={handleLogin} style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2em'}}>
          <label htmlFor="gafete" className="label-login" style={{fontWeight: 500, color: '#1976d2', fontSize: '1.1em'}}>Escanea el código de barras del gafete:</label>
          <input
            id="gafete"
            type="text"
            value={gafeteScan}
            onChange={e => setGafeteScan(e.target.value)}
            autoFocus
            className="input-login"
            placeholder="Escanea o escribe tu gafete"
            style={{padding: '1em', fontSize: '1.15em', borderRadius: '0.5em', border: '1px solid #b0b0b0', marginBottom: 0}}
          />
          <button type="submit" className="btn btn-login" style={{fontSize: '1.15em', padding: '0.9em', borderRadius: '0.5em'}}>Ingresar</button>
          {error && <div className="error-login" style={{color: '#d32f2f', background: '#ffeaea', borderRadius: '0.4em', padding: '0.7em 1em', textAlign: 'center', fontWeight: 'bold'}}>{error}</div>}
        </form>
      </div>
    </div>
  );
}
