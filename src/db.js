// Limpia el prefijo "CF" de un gafete si existe
export function limpiarGafete(gafete) {
  if (typeof gafete !== 'string') return gafete;
  let limpio = gafete.trim();
  if (limpio.startsWith('CF')) limpio = limpio.slice(2);
  return limpio.trim();
}

// Limpia el LCODE escaneado: quita espacios, prefijos antes de guion y lo deja en mayúsculas
export function limpiarLcode(lcode) {
  if (typeof lcode !== 'string') return lcode;
  let limpio = lcode.trim();
  // Si tiene guion, toma la parte después del primer guion
  if (limpio.includes('-')) limpio = limpio.split('-')[1];
  return limpio.trim().toUpperCase();
}

// Cambia esta URL por la de tu backend si es necesario
const API_URL = 'https://criticos-production.up.railway.app';

// Funciones básicas para cada tabla

// --- CABLES ---
export async function addCable(cable) {
  const res = await fetch(`${API_URL}/cables`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cable)
  });
  if (!res.ok) throw new Error('Error al agregar cable');
  return await res.json();
}

export async function getCable(lcode) {
  const limpio = limpiarLcode(lcode);
  const res = await fetch(`${API_URL}/cables/${limpio}`);
  if (!res.ok) return null;
  return await res.json();
}

export async function getCables() {
  const res = await fetch(`${API_URL}/cables`);
  if (!res.ok) return [];
  return await res.json();
}

export async function updateCable(lcode, cable) {
  const res = await fetch(`${API_URL}/cables/${lcode}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cable)
  });
  if (!res.ok) throw new Error('Error al actualizar cable');
  return await res.json();
}

export async function deleteCable(lcode) {
  const res = await fetch(`${API_URL}/cables/${lcode}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar cable');
  return await res.json();
}

// --- DISPAROS ---
export async function addDisparo(disparo) {
  const res = await fetch(`${API_URL}/disparos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(disparo)
  });
  if (!res.ok) throw new Error('Error al agregar disparo');
  return await res.json();
}

export async function getDisparos() {
  const res = await fetch(`${API_URL}/disparos`);
  if (!res.ok) return [];
  return await res.json();
}

export async function updateDisparo(id, data) {
  const res = await fetch(`${API_URL}/disparos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al actualizar disparo');
  return await res.json();
}

export async function deleteDisparo(id) {
  const res = await fetch(`${API_URL}/disparos/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar disparo');
  return await res.json();
}

// --- HISTORIAL ---
export async function addHistorial(hist) {
  const res = await fetch(`${API_URL}/historial`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hist)
  });
  if (!res.ok) throw new Error('Error al agregar historial');
  return await res.json();
}

export async function getHistorial() {
  const res = await fetch(`${API_URL}/historial`);
  if (!res.ok) return [];
  return await res.json();
}

// --- USUARIOS ---
export async function addUsuario(usuario) {
  const res = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  });
  if (!res.ok) throw new Error('Error al agregar usuario');
  return await res.json();
}

export async function getUsuario(gafete) {
  const res = await fetch(`${API_URL}/usuarios/${gafete}`);
  if (!res.ok) return null;
  return await res.json();
}

export async function getUsuarios() {
  const res = await fetch(`${API_URL}/usuarios`);
  if (!res.ok) return [];
  return await res.json();
}

export async function updateUsuario(gafete, usuario) {
  const res = await fetch(`${API_URL}/usuarios/${gafete}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  });
  if (!res.ok) throw new Error('Error al actualizar usuario');
  return await res.json();
}

export async function deleteUsuario(gafete) {
  const res = await fetch(`${API_URL}/usuarios/${gafete}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar usuario');
  return await res.json();
}

// Función de depuración para verificar si el gafete existe en la tabla usuarios
export async function debugCheckGafete(gafete) {
  return await getUsuario(gafete);
}
