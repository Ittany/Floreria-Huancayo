import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [verPromo, setVerPromo] = useState(true);
  const [hora] = useState(() => new Date().getHours());

  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <section className="home">
      <div className="hero">
        <p className="hero__saludo">{saludo}, bienvenido a Huancayo 🌄</p>
        <h1 className="hero__title">
          Flores frescas del Valle del Mantaro, <br />
          entregadas el mismo día
        </h1>
        <p className="hero__sub">
          Ramos, boxes y arreglos armados a mano en nuestro taller de Av. Real.
        </p>

        <div className="hero__actions">
          <Link to="/catalogo" className="btn btn--primary">
            Ver catálogo
          </Link>
          <Link to="/pedido" className="btn btn--outline">
            Hacer un pedido
          </Link>
        </div>
      </div>

      {/* Condicional con && : solo se pinta si verPromo es true */}
      {verPromo && (
        <div className="promo">
          <p>
            🎉 <strong>Promo Huancayo:</strong> 15% de descuento en pedidos dentro de la
            ciudad pagando con Yape.
          </p>
          <button className="promo__close" onClick={() => setVerPromo(false)}>
            Cerrar
          </button>
        </div>
      )}

      {!verPromo && (
        <button className="btn btn--ghost" onClick={() => setVerPromo(true)}>
          Mostrar promoción
        </button>
      )}

      <div className="info-grid">
        <div className="info-card">
          <h3>Delivery</h3>
          <p>El Tambo, Chilca, Huancayo y San Agustín de Cajas.</p>
        </div>
        <div className="info-card">
          <h3>Personalizado</h3>
          <p>Elige colores, tamaño y tarjeta dedicatoria.</p>
        </div>
        <div className="info-card">
          <h3>Horario</h3>
          <p>Lunes a sábado, 8:00 a.m. – 8:00 p.m.</p>
        </div>
      </div>
    </section>
  );
}