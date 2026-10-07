import { Link, useLocation } from 'react-router-dom';

export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <section className="estado estado--404">
      <h1>404</h1>
      <p>
        No encontramos la ruta <code>{pathname}</code> en la florería.
      </p>
      <Link to="/" className="btn btn--primary">
        Volver al inicio
      </Link>
    </section>
  );
}