import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsuario } from './db';

export default function Login() {
  const [gafeteScan, setGafeteScan] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  return (
    <div className="container" style={{maxWidth: 400, margin: '4rem auto'}}>
      <h1 style={{textAlign: 'center', color: '#1976d2', marginBottom: '1.5em'}}>Inicio de sesión</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="gafete">Escanea el código de barras del gafete:</label>
        <input
          id="gafete"
          type="text"
          value={gafeteScan}
          onChange={e => setGafeteScan(e.target.value)}
          placeholder="CF60507586"
          autoFocus
        />
        <button type="submit" className="btn" style={{marginTop: '1em', width: '100%'}}>Ingresar</button>
        {error && <div style={{color: 'red', marginTop: '1em'}}>{error}</div>}
      </form>
    </div>
  );
}
