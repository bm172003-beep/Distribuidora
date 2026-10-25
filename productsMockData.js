/**
 * productsMockData.js
 * ---------------------------------------------------------------------------
 * Dataset LOCAL y AISLADO para "Distribuidora Medina & Medel".
 *
 * Este archivo es un módulo independiente de datos de ejemplo, pensado para que
 * el catálogo funcione HOY,
 * mientras se crea y conecta el nuevo proyecto Firebase de la distribuidora.
 *
 * Cuando el nuevo proyecto Firebase esté listo, solo hay que:
 *   1) Completar las credenciales en `firebaseMedinaMedel.js`.
 *   2) Cambiar la constante DATA_SOURCE = 'firebase' en catalogo-distribuidora.html
 *   3) Cargar estos mismos productos (o los que definas) en la colección
 *      "productos_distribuidora" de ese nuevo proyecto.
 *
 * Estructura de precios de cada producto:
 *   - unit  -> precio TOTAL por 1 unidad (despacho incluido)
 *   - pack2 -> precio TOTAL por el pack de 2 unidades (con descuento)
 *   - pack6 -> precio POR UNIDAD al comprar la media docena (tarifa mayorista/reventa)
 * ---------------------------------------------------------------------------
 */

export const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'hogar', label: 'Hogar y Cocina' },
  { id: 'cuidado', label: 'Cuidado Personal' },
  { id: 'suplementos', label: 'Suplementos y Bienestar' },
  { id: 'herramientas', label: 'Herramientas' },
];

// Ícono decorativo por categoría (se usa como imagen "placeholder" de la tarjeta
// mientras no se cargan fotos reales de producto desde Firebase Storage).
export const CATEGORY_ICON = {
  hogar: '🍳',
  cuidado: '🧴',
  suplementos: '💊',
  herramientas: '🛠️',
};

export const CATEGORY_LABEL = CATEGORIES.reduce((acc, c) => {
  acc[c.id] = c.label;
  return acc;
}, {});

/**
 * @typedef {Object} ProductPack
 * @property {number} qty
 * @property {string} label
 * @property {number} priceTotal   // lo que paga el cliente por ESE pack completo
 * @property {number} pricePerUnit
 * @property {string} [badge]
 */

export function buildPacks({ unit, pack2, pack6Unit }) {
  return {
    unit: {
      qty: 1,
      label: '1 Unidad',
      priceTotal: unit,
      pricePerUnit: unit,
      badge: null,
      whatsappLabel: '1 und',
    },
    pack2: {
      qty: 2,
      label: 'Pack x2 Unidades',
      priceTotal: pack2,
      pricePerUnit: Math.round(pack2 / 2),
      badge: 'Más Vendido · Ahorra',
      whatsappLabel: 'Pack 2x',
    },
    pack6: {
      qty: 6,
      label: 'Media Docena (6 Unidades)',
      priceTotal: pack6Unit * 6,
      pricePerUnit: pack6Unit,
      badge: 'Tarifa Mayorista / Reventa',
      whatsappLabel: 'Pack 6x',
    },
  };
}

export const products = [
  {
    id: 'compresor-air-bolt-12v',
    sku: 'MM-HER-001',
    name: 'Compresor de Aire Portátil Air Bolt 12V',
    category: 'herramientas',
    tags: ['Hogar', 'Herramientas'],
    description: 'Compresor de aire portátil 12V, ideal para inflar neumáticos, pelotas y colchones inflables. Uso doméstico y en el auto.',
    photo: '',
    photos: [],   // varias fotos por producto (URLs o dataURL). La primera es la portada.
    packs: buildPacks({ unit: 18990, pack2: 32990, pack6Unit: 14990 }),
  },
  {
    id: 'arnes-soporte-ergonomico',
    sku: 'MM-CUI-002',
    name: 'Arnés de Soporte Ergonómico Ajustable Unisex',
    category: 'cuidado',
    tags: ['Cuidado Personal', 'Postura'],
    description: 'Corrector de postura ajustable unisex, ayuda a alinear hombros y espalda durante el trabajo o el ejercicio.',
    photo: '',
    photos: [],   // varias fotos por producto (URLs o dataURL). La primera es la portada.
    packs: buildPacks({ unit: 24990, pack2: 39990, pack6Unit: 16990 }),
  },
  {
    id: 'irrigador-dental-miracle-smile',
    sku: 'MM-CUI-003',
    name: 'Irrigador Dental Miracle Smile 360° Recargable',
    category: 'cuidado',
    tags: ['Cuidado Personal', 'Higiene Bucal'],
    description: 'Irrigador dental recargable con boquilla giratoria 360°, ideal para una limpieza profunda entre los dientes y encías.',
    photo: '',
    photos: [],   // varias fotos por producto (URLs o dataURL). La primera es la portada.
    packs: buildPacks({ unit: 27990, pack2: 47990, pack6Unit: 19990 }),
  },
  {
    id: 'sarten-xtrem-cook-24cm',
    sku: 'MM-HOG-004',
    name: 'Sartén Antiadherente Cerámica 24cm Xtrem Cook con Tapa',
    category: 'hogar',
    tags: ['Hogar y Cocina', 'Cocina'],
    description: 'Sartén de cerámica antiadherente de 24cm con tapa de vidrio templado, apta para todo tipo de cocinas.',
    photo: '',
    photos: [],   // varias fotos por producto (URLs o dataURL). La primera es la portada.
    packs: buildPacks({ unit: 24990, pack2: 38990, pack6Unit: 16990 }),
  },
  {
    id: 'perfect-belly-sos',
    sku: 'MM-SUP-005',
    name: 'Suplemento Reductor Perfect Belly S.O.S.',
    category: 'suplementos',
    tags: ['Suplementos', 'Control de Peso'],
    description: 'Suplemento en cápsulas pensado como apoyo a una rutina de alimentación balanceada y actividad física.',
    photo: '',
    photos: [],   // varias fotos por producto (URLs o dataURL). La primera es la portada.
    packs: buildPacks({ unit: 29990, pack2: 49990, pack6Unit: 21990 }),
  },
  {
    id: 'sleep-zen',
    sku: 'MM-SUP-006',
    name: 'Suplemento Sueño Profundo Sleep Zen',
    category: 'suplementos',
    tags: ['Suplementos', 'Descanso'],
    description: 'Fórmula pensada para apoyar la relajación antes de dormir, como parte de una buena rutina de descanso.',
    photo: '',
    photos: [],   // varias fotos por producto (URLs o dataURL). La primera es la portada.
    packs: buildPacks({ unit: 26990, pack2: 44990, pack6Unit: 18990 }),
  },
  {
    id: 'sani-nails-30ml',
    sku: 'MM-CUI-007',
    name: 'Solución Reparadora de Uñas Sani Nails 30ml',
    category: 'cuidado',
    tags: ['Cuidado Personal', 'Uñas'],
    description: 'Solución tópica de 30ml formulada para el cuidado e hidratación de uñas debilitadas.',
    photo: '',
    photos: [],   // varias fotos por producto (URLs o dataURL). La primera es la portada.
    packs: buildPacks({ unit: 27990, pack2: 47990, pack6Unit: 19990 }),
  },
  {
    id: 'calvistop-30ml',
    sku: 'MM-CUI-008',
    name: 'Tónico Capilar Anticaída Calvistop 30ml',
    category: 'cuidado',
    tags: ['Cuidado Personal', 'Cabello'],
    description: 'Tónico capilar de 30ml formulado para fortalecer el cuero cabelludo y acompañar rutinas anticaída.',
    photo: '',
    photos: [],   // varias fotos por producto (URLs o dataURL). La primera es la portada.
    packs: buildPacks({ unit: 27990, pack2: 47990, pack6Unit: 19990 }),
  },
  {
    id: 'osteoregen-calcio',
    sku: 'MM-SUP-009',
    name: 'Fortalecedor Óseo OsteoRegen Calcio Inteligente',
    category: 'suplementos',
    tags: ['Suplementos', 'Huesos'],
    description: 'Suplemento con calcio pensado como aporte complementario para la salud ósea diaria.',
    photo: '',
    photos: [],   // varias fotos por producto (URLs o dataURL). La primera es la portada.
    packs: buildPacks({ unit: 29990, pack2: 49990, pack6Unit: 20990 }),
  },
  {
    id: 'magnecalm-pro',
    sku: 'MM-SUP-010',
    name: 'Bisglicinato de Magnesio Magnecalm Pro + B6 D3',
    category: 'suplementos',
    tags: ['Suplementos', 'Magnesio'],
    description: 'Magnesio bisglicinato combinado con vitamina B6 y D3, pensado como apoyo complementario diario.',
    photo: '',
    photos: [],   // varias fotos por producto (URLs o dataURL). La primera es la portada.
    packs: buildPacks({ unit: 25990, pack2: 43990, pack6Unit: 18990 }),
  },
];

/**
 * Simula la interfaz "en tiempo real" que expone firebaseMedinaMedel.js
 * (onSnapshot), para que el catálogo pueda usar el mismo código sin
 * importar si la fuente de datos es este mock o Firebase real.
 * @param {(items: typeof products) => void} callback
 * @returns {() => void} función para "desuscribirse" (no-op en el mock)
 */
export function getProductsRealtimeMock(callback) {
  callback(products);
  return () => {};
}
