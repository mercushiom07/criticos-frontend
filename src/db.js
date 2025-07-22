import { openDB } from 'idb';

export const dbPromise = openDB('criticos-db', 2, {
  upgrade(db, oldVersion, newVersion) {
    // Tabla Cables
    if (!db.objectStoreNames.contains('cables')) {
      const store = db.createObjectStore('cables', { keyPath: 'LCODE' });
      store.createIndex('LCODE', 'LCODE', { unique: true });
    }
    // Tabla Disparos
    if (!db.objectStoreNames.contains('disparos')) {
      const store = db.createObjectStore('disparos', { keyPath: 'id', autoIncrement: true });
      store.createIndex('LINEA', 'LINEA');
      store.createIndex('ESTATUS', 'ESTATUS');
    } else if (oldVersion < 2) {
      // Actualizar la store para agregar el campo ESTATUS si ya existe
      const store = db.transaction.objectStore('disparos');
      if (!store.indexNames.contains('ESTATUS')) {
        store.createIndex('ESTATUS', 'ESTATUS');
      }
    }
    // Tabla Historial
    if (!db.objectStoreNames.contains('historial')) {
      db.createObjectStore('historial', { keyPath: 'id', autoIncrement: true });
    }
    // Tabla Usuarios
    if (!db.objectStoreNames.contains('usuarios')) {
      db.createObjectStore('usuarios', { keyPath: 'GAFETE' });
    }
  },
});

// Funciones básicas para cada tabla
export async function addCable(cable) {
  const db = await dbPromise;
  await db.put('cables', cable);
}

export async function getCable(lcode) {
  const db = await dbPromise;
  return db.get('cables', lcode);
}

export async function addDisparo(disparo) {
  const db = await dbPromise;
  await db.add('disparos', {
    ...disparo,
    ESTATUS: 'CRITICO'
  });
}

export async function getDisparos() {
  const db = await dbPromise;
  return db.getAll('disparos');
}

export async function addHistorial(hist) {
  const db = await dbPromise;
  await db.add('historial', hist);
}

export async function getHistorial() {
  const db = await dbPromise;
  return db.getAll('historial');
}

export async function addUsuario(usuario) {
  const db = await dbPromise;
  await db.put('usuarios', usuario);
}

export async function getUsuario(gafete) {
  const db = await dbPromise;
  return db.get('usuarios', gafete);
}

export async function getCables() {
  const db = await dbPromise;
  return db.getAll('cables');
}
// Función de depuración para verificar si el gafete existe en la tabla usuarios
export async function debugCheckGafete(gafete) {
  const db = await dbPromise;
  const usuario = await db.get('usuarios', gafete);
  console.log('Usuario encontrado:', usuario);
  return usuario;
}
// Obtener todos los usuarios
export async function getUsuarios() {
  const db = await dbPromise;
  return db.getAll('usuarios');
}
