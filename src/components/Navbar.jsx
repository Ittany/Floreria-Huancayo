import { NavLink } from 'react-router-dom';

const claseLink = ({ isActive }) =>
  isActive ? 'nav-link nav-link--active' : 'nav-link';

export default function Navbar({
  logoUrl = 'https://www.logodesignteam.com/images/portfolio-images/best-logos-logo-design/28.jpg',
  nombreTienda = 'El Ramo Huanca',
}) {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        {logoUrl ? (
          <img
            className="navbar__logo"
            src={logoUrl}
            alt={`Logo de ${nombreTienda}`}
          />
        ) : (
          <span className="navbar__logo navbar__logo--fallback" aria-hidden="true">
            {nombreTienda.charAt(0)}
          </span>
        )}

        <span className="navbar__nombre">{nombreTienda}</span>
      </div>

      <nav className="navbar__links">
        <NavLink to="/" className={claseLink} end>Inicio</NavLink>
        <NavLink to="/catalogo" className={claseLink}>Catálogo</NavLink>
        <NavLink to="/pedido" className={claseLink}>Pedidos</NavLink>
      </nav>
    </header>
  );
}