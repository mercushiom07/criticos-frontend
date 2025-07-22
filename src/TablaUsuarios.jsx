import React, { useEffect, useState } from 'react';
import { getUsuario } from './db';
import { getUsuarios, addUsuario } from './db';

export default function TablaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombreUsuario, setNombreUsuario] = useState('');
  useEffect(() => {
    const gafete = localStorage.getItem('gafete');
    if (gafete) {
      getUsuario(gafete).then(u => setNombreUsuario(u?.NOMBRE || ''));
    }
  }, []);
  const handleIrMenu = () => {
    window.location.href = '/menu-metodos';
  };
  const [form, setForm] = useState({ NOMBRE: '', GAFETE: '', DEPARTAMENTO: '', RUTA_MAQUINA: '', TIPO_USUARIO: '' });
  const [editGafete, setEditGafete] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    if (getUsuarios) {
      const lista = await getUsuarios();
      setUsuarios(lista);
    } else {
      // fallback: obtener todos los usuarios por claves conocidas
      setUsuarios([]);
    }
  }

  async function handleAddOrEdit(e) {
    e.preventDefault();
    await addUsuario(form);
    setForm({ NOMBRE: '', GAFETE: '', DEPARTAMENTO: '', RUTA_MAQUINA: '', TIPO_USUARIO: '' });
    setEditGafete(null);
    await cargarUsuarios();
  }

  function handleEdit(usuario) {
    setForm(usuario);
    setEditGafete(usuario.GAFETE);
  }

  async function handleDelete(gafete) {
    const db = await import('./db');
    const dbInstance = await db.dbPromise;
    await dbInstance.delete('usuarios', gafete);
    await cargarUsuarios();
  }

  return (
    <div style={{padding: '2em'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em'}}>
        <span style={{fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em'}}>
          Usuario: {nombreUsuario}
        </span>
        <button className="btn" style={{width: 180, background: '#1976d2'}} onClick={handleIrMenu}>Regresar al menú</button>
      </div>
      <h2>Tabla de Usuarios</h2>
      <form onSubmit={handleAddOrEdit} style={{marginBottom: '2em'}}>
        <input required placeholder="Nombre" value={form.NOMBRE} onChange={e => setForm(f => ({...f, NOMBRE: e.target.value}))} />{' '}
        <input required placeholder="Gafete" value={form.GAFETE} onChange={e => setForm(f => ({...f, GAFETE: e.target.value}))} />{' '}
        <input required placeholder="Departamento" value={form.DEPARTAMENTO} onChange={e => setForm(f => ({...f, DEPARTAMENTO: e.target.value}))} />{' '}
        <input required placeholder="Ruta/Máquina" value={form.RUTA_MAQUINA} onChange={e => setForm(f => ({...f, RUTA_MAQUINA: e.target.value}))} />{' '}
        <input required placeholder="Tipo de usuario" value={form.TIPO_USUARIO} onChange={e => setForm(f => ({...f, TIPO_USUARIO: e.target.value}))} />{' '}
        <button type="submit">{editGafete ? 'Modificar' : 'Agregar'} usuario</button>
        {editGafete && <button type="button" onClick={() => { setForm({ NOMBRE: '', GAFETE: '', DEPARTAMENTO: '', RUTA_MAQUINA: '', TIPO_USUARIO: '' }); setEditGafete(null); }}>Cancelar edición</button>}
      </form>
      <table border="1" cellPadding="6" style={{width: '100%', background: '#fff'}}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Gafete</th>
            <th>Departamento</th>
            <th>Ruta/Máquina</th>
            <th>Tipo de usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.GAFETE}>
              <td>{u.NOMBRE}</td>
              <td>{u.GAFETE}</td>
              <td>{u.DEPARTAMENTO}</td>
              <td>{u.RUTA_MAQUINA}</td>
              <td>{u.TIPO_USUARIO}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Modificar</button>{' '}
                <button onClick={() => handleDelete(u.GAFETE)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
