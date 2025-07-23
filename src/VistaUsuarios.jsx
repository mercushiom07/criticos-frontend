
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsuarios, addUsuario, getUsuario, deleteUsuario, limpiarGafete } from './db';

// ...existing code...

const DEPTOS_LIMITADOS = ['LPS', 'CORTE', 'MFG'];

export default function VistaUsuarios() {
  const navigate = useNavigate();
  const handleCerrarSesion = () => {
    localStorage.removeItem('gafete');
    navigate('/login', { replace: true });
  };
  function handleIrMenu() {
    navigate('/menu-metodos');
  }
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [editando, setEditando] = useState(null); // id del usuario editando
  const [seleccionado, setSeleccionado] = useState(null); // gafete del usuario seleccionado
  const [nuevoUsuario, setNuevoUsuario] = useState({ NOMBRE: '', GAFETE: '', DEPARTAMENTO: '', RUTA_MAQUINA: '', TIPO_USUARIO: '' });
  const [modo, setModo] = useState('ver'); // 'ver', 'nuevo', 'editar'

  useEffect(() => {
    const gafete = localStorage.getItem('gafete');
    if (gafete) {
      getUsuario(limpiarGafete(gafete)).then(u => setUsuarioActivo(u));
    }
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    const lista = await getUsuarios();
    setUsuarios(lista);
  }

  function puedeEditar() {
    return usuarioActivo && usuarioActivo.TIPO_USUARIO === 'ADMIN';
  }

  function usuariosVisibles() {
    if (!usuarioActivo) return [];
    // Solo usuarios de METODOS pueden ver todos los registros
    if (usuarioActivo.DEPARTAMENTO === 'METODOS') return usuarios;
    // Todos los demás (incluyendo ADMIN) solo ven su propio departamento
    return usuarios.filter(u => u.DEPARTAMENTO === usuarioActivo.DEPARTAMENTO);
  }

  function handleNuevo() {
    setModo('nuevo');
    setNuevoUsuario({ NOMBRE: '', GAFETE: '', DEPARTAMENTO: '', RUTA_MAQUINA: '', TIPO_USUARIO: '' });
  }

  function handleEditar() {
    if (!seleccionado) return;
    const u = usuarios.find(u => u.GAFETE === seleccionado);
    if (u) {
      setModo('editar');
      setEditando(u.GAFETE);
      setNuevoUsuario({ ...u });
    }
  }

  function handleCancelar() {
    setModo('ver');
    setEditando(null);
    setNuevoUsuario({ NOMBRE: '', GAFETE: '', DEPARTAMENTO: '', RUTA_MAQUINA: '', TIPO_USUARIO: '' });
  }

  async function handleGuardar() {
    await addUsuario(nuevoUsuario);
    setModo('ver');
    setEditando(null);
    setNuevoUsuario({ NOMBRE: '', GAFETE: '', DEPARTAMENTO: '', RUTA_MAQUINA: '', TIPO_USUARIO: '' });
    await cargarUsuarios();
  }

  async function handleEliminar() {
    if (!seleccionado) return;
    await deleteUsuario(seleccionado);
    setSeleccionado(null);
    await cargarUsuarios();
  }

  return (
    <div className="responsive-vista-usuarios">
      <h2 style={{textAlign: 'center', color: '#1976d2', marginBottom: '1.5em'}}>Gestión de Usuarios</h2>
      <div style={{marginBottom: '1em', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <span style={{fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em'}}>
          Usuario activo: {usuarioActivo?.NOMBRE || ''} ({usuarioActivo?.TIPO_USUARIO || ''})
        </span>
        <div style={{display: 'flex', gap: '0.5em'}}>
          <button className="btn" style={{width: 120, background: '#1976d2'}} onClick={handleIrMenu}>Regresar al menú</button>
        </div>
      </div>
      {puedeEditar() && modo === 'ver' && (
        <div style={{marginBottom: '1em', display: 'flex', gap: '1em'}}>
          <button className="btn" onClick={handleNuevo}>Registrar nuevo usuario</button>
          <button className="btn" onClick={handleEditar} disabled={!seleccionado}>Modificar</button>
          <button className="btn" onClick={handleEliminar} disabled={!seleccionado}>Eliminar</button>
        </div>
      )}
      <table className="admin-table" style={{width: '100%', fontSize: '12px', wordBreak: 'break-word'}}>
        <thead>
          <tr>
            <th></th>
            <th>GAFETE</th>
            <th>NOMBRE</th>
            <th>DEPARTAMENTO</th>
            <th>RUTA_MAQUINA</th>
            <th>TIPO_USUARIO</th>
          </tr>
        </thead>
        <tbody>
          {modo === 'nuevo' && (
            <tr>
              <td></td>
              <td><input value={nuevoUsuario.GAFETE} onChange={e => setNuevoUsuario(u => ({...u, GAFETE: e.target.value}))} /></td>
              <td><input value={nuevoUsuario.TIPO_USUARIO} onChange={e => setNuevoUsuario(u => ({...u, TIPO_USUARIO: e.target.value}))} /></td>
              <td>
                <button className="btn" onClick={handleGuardar}>Guardar</button>
                <button className="btn" onClick={handleCancelar}>Cancelar</button>
              </td>
            </tr>
          )}
          {usuariosVisibles().map(u => modo === 'editar' && editando === u.GAFETE ? (
            <tr key={u.GAFETE}>
              <td></td>
              <td><input value={nuevoUsuario.GAFETE} onChange={e => setNuevoUsuario(usr => ({...usr, GAFETE: e.target.value}))} /></td>
              <td><input value={nuevoUsuario.NOMBRE} onChange={e => setNuevoUsuario(usr => ({...usr, NOMBRE: e.target.value}))} /></td>
              <td><input value={nuevoUsuario.DEPARTAMENTO} onChange={e => setNuevoUsuario(usr => ({...usr, DEPARTAMENTO: e.target.value}))} /></td>
              <td><input value={nuevoUsuario.RUTA_MAQUINA} onChange={e => setNuevoUsuario(usr => ({...usr, RUTA_MAQUINA: e.target.value}))} /></td>
              <td><input value={nuevoUsuario.TIPO_USUARIO} onChange={e => setNuevoUsuario(usr => ({...usr, TIPO_USUARIO: e.target.value}))} /></td>
              <td>
                <button className="btn" onClick={handleGuardar}>Guardar</button>
                <button className="btn" onClick={handleCancelar}>Cancelar</button>
              </td>
            </tr>
          ) : (
            <tr key={u.GAFETE} style={{background: seleccionado === u.GAFETE ? '#e3eafc' : undefined}}>
              <td>
                <input type="radio" name="seleccionUsuario" checked={seleccionado === u.GAFETE} onChange={() => setSeleccionado(u.GAFETE)} />
              </td>
              <td>{u.GAFETE}</td>
              <td>{u.NOMBRE}</td>
              <td>{u.DEPARTAMENTO}</td>
              <td>{u.RUTA_MAQUINA}</td>
              <td>{u.TIPO_USUARIO}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
