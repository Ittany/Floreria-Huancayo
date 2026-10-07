import { NavLink } from 'react-router-dom';

const claseLink = ({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link');

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">🌸</span>
        <span>El Ramo Huanca</span>
      </div>

      <nav className="navbar__links">
        <NavLink to="/" className={claseLink} end>
          Inicio
        </NavLink>
        <NavLink to="/catalogo" className={claseLink}>
          Catálogo
        </NavLink>
        <NavLink to="/pedido" className={claseLink}>
          Hacer pedido
        </NavLink>
      </nav>
    </header>
  );
}