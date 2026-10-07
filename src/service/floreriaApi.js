import axios from 'axios';

// Cliente axios centralizado: una sola baseURL para todo el proyecto.
export const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const CATALOGO_LOCAL = [
  { nombre: 'Ramo de Rosas Rojas',      imagen: 'https://picsum.photos/seed/rosas/600/400',   categoria: 'Ramos' },
  { nombre: 'Box de Tulipanes',         imagen: 'https://picsum.photos/seed/tulipan/600/400', categoria: 'Box' },
  { nombre: 'Arreglo de Girasoles',     imagen: 'https://picsum.photos/seed/girasol/600/400', categoria: 'Arreglos' },
  { nombre: 'Orquídea Phalaenopsis',    imagen: 'https://picsum.photos/seed/orquidea/600/400',categoria: 'Plantas' },
  { nombre: 'Ramo de Peonías',          imagen: 'https://picsum.photos/seed/peonia/600/400',  categoria: 'Ramos' },
  { nombre: 'Box de Rosas y Chocolates',imagen: 'https://picsum.photos/seed/boxchoco/600/400',categoria: 'Box' },
  { nombre: 'Arreglo de Lilas',         imagen: 'https://picsum.photos/seed/lilas/600/400',   categoria: 'Arreglos' },
  { nombre: 'Suculenta en Maceta',      imagen: 'https://picsum.photos/seed/suculenta/600/400',categoria: 'Plantas' },
  { nombre: 'Ramo de Margaritas',       imagen: 'https://picsum.photos/seed/margarita/600/400',categoria: 'Ramos' },
  { nombre: 'Corona de Condolencia',    imagen: 'https://picsum.photos/seed/corona/600/400',  categoria: 'Coronas' },
  { nombre: 'Arreglo de Claveles',      imagen: 'https://picsum.photos/seed/clavel/600/400',  categoria: 'Arreglos' },
  { nombre: 'Box de Gerberas',          imagen: 'https://picsum.photos/seed/gerbera/600/400', categoria: 'Box' },
];

/**
 * GET /products → lista de arreglos florales.
 * @param {AbortSignal} signal  señal para cancelar la petición en el cleanup
 */
export const getArreglos = async (signal) => {
  const { data } = await api.get('/products?limit=12', { signal });

  return data.products.map((producto, i) => {
    const local = CATALOGO_LOCAL[i % CATALOGO_LOCAL.length];
    return {
      id: producto.id,
      nombre: local.nombre,
      imagen: local.imagen,
      categoria: local.categoria,
      precio: producto.price,    
      rating: producto.rating,   
      stock: producto.stock,     
    };
  });
};

export const crearPedido = async (pedido) => {
  const { data } = await api.post('/products/add', {
    title: `Pedido florería - ${pedido.nombre}`,
    ...pedido,
  });
  return data;
};