export default function FlorCard({ arreglo, children }) {
  return (
    <article className="card">
      <img
        className="card__img"
        src={arreglo.imagen}
        alt={arreglo.nombre}
        loading="lazy"
        onError={(e) => {
          // si la imagen no carga
          e.currentTarget.src = 'https://picsum.photos/seed/flor/600/400';
        }}
      />

      <div className="card__body">
        <span className="card__tag">{arreglo.categoria}</span>
        <h3 className="card__title">{arreglo.nombre}</h3>
        <p className="card__meta">
          ⭐ {arreglo.rating} · Stock: {arreglo.stock}
        </p>
        <p className="card__price">S/ {arreglo.precio.toFixed(2)}</p>

        {/* children = cdecide el padre (aquí, el botón) */}
        {children}
      </div>
    </article>
  );
}