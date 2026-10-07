import { useMemo, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { getArreglos } from '../services/floreriaApi';
import FlorCard from '../components/FlorCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIAS = ['Todas', 'Ramos', 'Box', 'Arreglos', 'Plantas', 'Coronas'];

export default function Catalogo() {
  const { data: arreglos, loading, error, recargar } = useFetch(getArreglos, []);

  // (onChange) + filtro por categoría
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');

  // useMemo evita
  const filtrados = useMemo(() => {
    if (!arreglos) return [];
    const texto = busqueda.trim().toLowerCase();

    return arreglos.filter((a) => {
      const coincideTexto = a.nombre.toLowerCase().includes(texto);
      const coincideCategoria = categoria === 'Todas' || a.categoria === categoria;
      return coincideTexto && coincideCategoria;
    });
  }, [arreglos, busqueda, categoria]);

  return (
    <section className="catalogo">
      <header className="catalogo__head">
        <h1>Catálogo de arreglos</h1>
        <p>Precios referenciales. Stock actualizado en tiempo real.</p>
      </header>

      {/* Formulario de búsqueda controlado */}
      <div className="filtros">
        <input
          type="search"
          className="input"
          placeholder="Buscar: rosas, box, girasoles..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar arreglo floral"
        />

        <div className="chips">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              className={cat === categoria ? 'chip chip--active' : 'chip'}
              onClick={() => setCategoria(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Renderizado condicional: loading error Vacío  lista */}
      {loading && <Loader />}

      {!loading && error && <ErrorMessage mensaje={error} onReintentar={recargar} />}

      {!loading && !error && filtrados.length === 0 && (
        <div className="estado estado--vacio">
          <p>🔍 No encontramos arreglos con esos filtros.</p>
          <button
            className="btn btn--outline"
            onClick={() => {
              setBusqueda('');
              setCategoria('Todas');
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {!loading && !error && filtrados.length > 0 && (
        <div className="grid">
          {/* Renderizado iterativo. key = id de la API */}
          {filtrados.map((arreglo) => (
            <FlorCard key={arreglo.id} arreglo={arreglo}>
              <button className="btn btn--primary btn--block">
                Agregar al pedido
              </button>
            </FlorCard>
          ))}
        </div>
      )}
    </section>
  );
}