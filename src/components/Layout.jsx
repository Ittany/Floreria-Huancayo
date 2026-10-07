import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar
        logoUrl="https://tse2.mm.bing.net/th/id/OIP.sCJkDUSY4x56MFqOD86_7gHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
        nombreTienda="El Ramo Huanca"
      />

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p className="app-footer__nombre">Brittany Gonzales Quiñonez</p>
        <p>Ingeniería de Sistemas — Noveno ciclo</p>
        <p>Huancayo, Junín</p>
      </footer>
    </div>
  );
}