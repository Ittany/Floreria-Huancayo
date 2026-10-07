import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <h2>🌸 Flowers Huancayo</h2>
      <div className="links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'activo' : '')}>
          Inicio
        </NavLink>
        <NavLink to="/catalogo" className={({ isActive }) => (isActive ? 'activo' : '')}>
          Catálogo
        </NavLink>
        <NavLink to="/pedido" className={({ isActive }) => (isActive ? 'activo' : '')}>
          Pedido
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar