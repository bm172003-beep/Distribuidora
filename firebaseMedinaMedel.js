/**
 * firebaseMedinaMedel.js
 * ---------------------------------------------------------------------------
 * Conexión Firebase EXCLUSIVA para "Distribuidora Medina & Medel".
 *
 * ⚠️ AISLAMIENTO DE DATOS:
 * Este archivo apunta a un proyecto de Firebase propio y exclusivo para este
 * catálogo. Lee solo de la colección "productos_distribuidora", de modo que
 * no comparte conexión, proyecto ni colección con ningún otro sitio.
 *
 * CÓMO ACTIVARLO:
 * 1. Crea un nuevo proyecto en https://console.firebase.google.com (por ejemplo
 *    "distribuidora-medina-medel").
 * 2. Habilita Firestore y crea la colección "productos_distribuidora".
 * 3. Copia las credenciales del nuevo proyecto (Configuración del proyecto >
 *    Tus apps > SDK setup) y reemplázalas abajo en `firebaseConfig`.
 * 4. En catalogo-distribuidora.html, cambia:
 *      const DATA_SOURCE = 'mock';   ->   const DATA_SOURCE = 'firebase';
 * 5. Sube tus productos a Firestore respetando esta forma (mismo shape que
 *    productsMockData.js):
 *    {
 *      name: string,
 *      category: 'hogar' | 'cuidado' | 'suplementos' | 'herramientas',
 *      photo: string (URL, opcional),
 *      isVisible: boolean (opcional, default true),
 *      packs: {
 *        unit:  { qty:1, label:'1 Unidad',                priceTotal:number, pricePerUnit:number },
 *        pack2: { qty:2, label:'Pack x2 Unidades',         priceTotal:number, pricePerUnit:number, badge:'Más Vendido · Ahorra' },
 *        pack6: { qty:6, label:'Media Docena (6 Unidades)',priceTotal:number, pricePerUnit:number, badge:'Tarifa Mayorista / Reventa' }
 *      }
 *    }
 * ---------------------------------------------------------------------------
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  initializeFirestore, persistentLocalCache, persistentMultipleTabManager,
  collection, doc, setDoc, deleteDoc, onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// ✅ Credenciales del proyecto Firebase de la distribuidora ("distribuidora-808ad").
// Este proyecto es 100% independiente de cualquier otro sitio.
// NOTA: estos valores de configuración web NO son secretos (cualquier visitante
// puede verlos en el navegador). La seguridad la dan las Reglas de Firestore y
// la configuración de Authentication. Ver README.
const firebaseConfig = {
  apiKey: "AIzaSyCA0OUk049j4sd3HjiI7bgDnurm-AgNnnI",
  authDomain: "distribuidora-808ad.firebaseapp.com",
  projectId: "distribuidora-808ad",
  storageBucket: "distribuidora-808ad.firebasestorage.app",
  messagingSenderId: "497812804996",
  appId: "1:497812804996:web:d98e370a1d27aa97e839d1",
};

let app = null;
let db = null;
let authInstance = null;

function ensureApp() {
  if (!app) {
    app = initializeApp(firebaseConfig, 'medina-medel-distribuidora'); // nombre de app único, evita colisión si conviven ambos proyectos en el mismo runtime

    // ⚠️ Algunas VPNs, redes corporativas o antivirus bloquean el canal
    // "streaming" (WebChannel) que usa Firestore por defecto, y eso se ve
    // como "Could not reach Cloud Firestore backend" o errores 400/404 en
    // firestore.googleapis.com. experimentalAutoDetectLongPolling hace que
    // el SDK detecte ese bloqueo solo y cambie a "long polling" (peticiones
    // normales, compatibles con cualquier red) sin que el usuario note nada.
    const networkOptions = { experimentalAutoDetectLongPolling: true, useFetchStreams: false };

    // ⚡ Velocidad: guarda los productos en el propio navegador (IndexedDB).
    // En la primera visita no cambia nada, pero en las siguientes el
    // catálogo/panel muestra de inmediato lo que ya tenía guardado mientras,
    // en paralelo, llega la versión más nueva desde Firebase. multiTabManager
    // permite que el catálogo y el panel compartan esa caché si están
    // abiertos en pestañas distintas del mismo navegador.
    try {
      db = initializeFirestore(app, {
        ...networkOptions,
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
      });
    } catch (err) {
      // Navegadores/pestañas privadas que no soportan IndexedDB persistente:
      // sigue funcionando igual, solo sin la caché local.
      console.warn('[firebaseMedinaMedel] Caché local no disponible, se continúa sin ella:', err);
      db = initializeFirestore(app, networkOptions);
    }
  }
  return db;
}

function ensureAuth() {
  ensureApp();
  if (!authInstance) authInstance = getAuth(app);
  return authInstance;
}

/**
 * Suscribe en tiempo real a la colección "productos_distribuidora".
 * Usada por el catálogo público (catalogo-distribuidora.html).
 * Solo trae productos con isVisible !== false.
 * @param {(items: any[]) => void} callback
 * @returns {() => void} función unsubscribe
 */
export function getProductsRealtimeFirebase(callback) {
  const firestore = ensureApp();
  const itemsCol = collection(firestore, "productos_distribuidora");
  const unsubscribe = onSnapshot(itemsCol, (snapshot) => {
    const items = snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((i) => i.isVisible !== false);
    callback(items);
  }, (err) => {
    console.error("[firebaseMedinaMedel] Error leyendo productos_distribuidora:", err);
  });
  return unsubscribe;
}

/**
 * Suscribe en tiempo real a TODOS los productos (incluidos los ocultos).
 * Usada por el panel de administración (inventario-distribuidora.html).
 * @param {(items: any[]) => void} callback
 * @returns {() => void} función unsubscribe
 */
export function getAllProductsRealtimeFirebase(callback) {
  const firestore = ensureApp();
  const itemsCol = collection(firestore, "productos_distribuidora");
  const unsubscribe = onSnapshot(itemsCol, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  }, (err) => {
    console.error("[firebaseMedinaMedel] Error leyendo productos_distribuidora:", err);
  });
  return unsubscribe;
}

/** Crea o sobreescribe un producto en "productos_distribuidora". */
export async function saveProductFirebase(product) {
  const firestore = ensureApp();
  await setDoc(doc(firestore, "productos_distribuidora", product.id), product);
}

/** Elimina un producto de "productos_distribuidora". */
export async function deleteProductFirebase(id) {
  const firestore = ensureApp();
  await deleteDoc(doc(firestore, "productos_distribuidora", id));
}

/**
 * Autenticación del panel admin (Firebase Auth, correo/contraseña).
 * Requiere haber habilitado el proveedor "Correo electrónico/Contraseña" en
 * Firebase Console > Authentication > Sign-in method, y crear ahí al menos
 * un usuario (Authentication > Users > Agregar usuario).
 */
export function watchAuthState(onChange) {
  const authRef = ensureAuth();
  return onAuthStateChanged(authRef, onChange);
}
export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(ensureAuth(), email, password);
}
export function logout() {
  return signOut(ensureAuth());
}
