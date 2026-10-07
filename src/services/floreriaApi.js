import axios from 'axios';

// Cliente axios centralizado: una sola baseURL para todo el proyecto.
export const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const CATALOGO_LOCAL = [
  { nombre: 'Ramo de Rosas Rojas',      imagen: 'https://tse3.mm.bing.net/th/id/OIP.tP-lu392sCzKvTfNwpqY7gHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',   categoria: 'Ramos' },
  { nombre: 'Box de Tulipanes',         imagen: 'https://tse1.mm.bing.net/th/id/OIP.4z8Y2WA4LbPDvezfpvcoAgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', categoria: 'Box' },
  { nombre: 'Arreglo de Girasoles',     imagen: 'https://tse3.mm.bing.net/th/id/OIP.uFx84ZhPdMjxolZIw8o-bgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', categoria: 'Arreglos' },
  { nombre: 'Orquídea Phalaenopsis',    imagen: 'https://florerialafleur.com/wp-content/uploads/2023/01/Conjunto-de-3-Orquideas-Phalaenopsis-Floreria-La-Fleur-Montevideo-Uruguay_3.jpg',categoria: 'Plantas' },
  { nombre: 'Ramo de Peonías',          imagen: 'https://tse3.mm.bing.net/th/id/OIP.H__MXrp4oe2F-Hv9TZhRJAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',  categoria: 'Ramos' },
  { nombre: 'Box de Rosas y Chocolates',imagen: 'https://tse3.mm.bing.net/th/id/OIP.Lpg4OL5s4bKzZVHD05GCYwHaGh?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',categoria: 'Box' },
  { nombre: 'Arreglo de Lilas',         imagen: 'https://tse1.mm.bing.net/th/id/OIP.A36qk51fZuNGqgf1358rIAHaJX?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',   categoria: 'Arreglos' },
  { nombre: 'Suculenta en Maceta',      imagen: 'https://tse1.mm.bing.net/th/id/OIP.bi743CKmMmtb61GRlglAMAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',categoria: 'Plantas' },
  { nombre: 'Ramo de Margaritas',       imagen: 'https://th.bing.com/th/id/OIP.9THEXZtKi3EZrQMMGFKQyAHaHa?w=185&h=185&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',categoria: 'Ramos' },
  { nombre: 'Corona de Condolencia',    imagen: 'https://th.bing.com/th/id/OIP.auZTxrlhheQHgw0W7yoDugHaId?w=160&h=183&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',  categoria: 'Coronas' },
  { nombre: 'Arreglo de Claveles',      imagen: 'https://th.bing.com/th/id/OIP.71YshUZK5mImJHwADqcNigHaHa?w=183&h=183&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',  categoria: 'Arreglos' },
  { nombre: 'Box de Gerberas',          imagen: 'https://th.bing.com/th/id/OIP.pyQZea0rGm8Kba9WwaYTxgHaIQ?w=181&h=202&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', categoria: 'Box' },
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