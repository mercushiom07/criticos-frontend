import React, { useEffect, useState } from 'react';
import { debugCheckGafete, addUsuario } from './db';

export default function DebugUsuario() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    checkUsuario();
    // eslint-disable-next-line
  }, []);

  async function checkUsuario() {
    const result = await debugCheckGafete('60507586');
    setUsuario(result);
  }

  async function handleAddUsuario() {
    await addUsuario({
      NOMBRE: 'Isaias Uribe',
      GAFETE: '60507586',
      DEPARTAMENTO: 'METODOS',
      RUTA_MAQUINA: 'INGENIERIA',
      TIPO_USUARIO: 'ADMINISTRADOR'
    });
    await checkUsuario();
    alert('Usuario agregado');
  }

  return (
    <div style={{padding: '2em'}}>
      <h2>Verificación de usuario por gafete</h2>
      <div>
        <button onClick={handleAddUsuario} style={{marginBottom: '1em'}}>Agregar usuario Isaias Uribe</button>
        {usuario ? (
          <pre>{JSON.stringify(usuario, null, 2)}</pre>
        ) : (
          <span>No se encontró el usuario con gafete 60507586.</span>
        )}
      </div>
    </div>
  );
}
