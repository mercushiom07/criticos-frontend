import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsuario, limpiarGafete } from './db';

export default function Login() {
  const [gafete, setGafete] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!gafete.trim()) {
      setError('Ingresa tu gafete');
      return;
    }
    const user = await getUsuario(limpiarGafete(gafete));
    if (user) {
      localStorage.setItem('gafete', limpiarGafete(gafete));
      navigate('/menu-metodos');
    } else {
      setError('Gafete no encontrado');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', minWidth: 320 }}>
        <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>Iniciar sesión</h2>
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Gafete"
            value={gafete}
            onChange={e => setGafete(e.target.value)}
            style={{ width: '100%', padding: 10, fontSize: 16, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>
        {error && <div style={{ color: '#d32f2f', marginBottom: 12, textAlign: 'center' }}>{error}</div>}
        <button type="submit" style={{ width: '100%', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 0', fontSize: 16, cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
    </div>
  );
}
