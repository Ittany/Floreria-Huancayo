import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        {/* Aquí se renderiza la página hija según la URL.
            Equivale a {children} en un componente de composición normal. */}
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>🌸 Florería "El Ramo Huanca" — Huancayo, Junín</p>
        <p>Av. Real 123 · +51 999 888 777</p>
      </footer>
    </div>
  );
}