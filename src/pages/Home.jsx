import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [verPromo, setVerPromo] = useState(true);

  const [hora] = useState(() => new Date().getHours());

  const saludo =
    hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <section className="home">
      <div className="hero">
        <p className="hero__saludo">{saludo}.</p>

        <h1 className="hero__title">
          Flores del Valle del Mantaro, <br />
          armadas el mismo día del pedido.
        </h1>

        <p className="hero__sub">
          Trabajamos con flores que llegan de huertas de Sicaya y Hualhuas. Si el
          pedido entra antes de las 3 de la tarde, sale el mismo día.
        </p>

        <div className="hero__actions">
          <Link to="/catalogo" className="btn btn--primary">
            Ver catálogo
          </Link>
          <Link to="/pedido" className="btn btn--outline">
            Armar un pedido
          </Link>
        </div>
      </div>

      {verPromo && (
        <div className="promo">
          <p>
            Hasta fin de mes, 15% de descuento en pedidos dentro de Huancayo
            pagando con Yape.
          </p>
          <button
            className="promo__close"
            onClick={() => setVerPromo(false)}
            aria-label="Cerrar aviso"
          >
            Cerrar
          </button>
        </div>
      )}

      {!verPromo && (
        <button className="btn btn--ghost" onClick={() => setVerPromo(true)}>
          Ver aviso
        </button>
      )}

      <div className="info-grid">
        <div className="info-card">
          <h3>Dónde entregamos</h3>
          <p>
            Huancayo, El Tambo, Chilca y San Agustín de Cajas. Otras zonas se
            coordinan por WhatsApp.
          </p>
        </div>

        <div className="info-card">
          <h3>Pedidos a medida</h3>
          <p>
            Nos dices el color, el tamaño y para quién es. Te mandamos una foto
            antes de que salga el reparto.
          </p>
        </div>

        <div className="info-card">
          <h3>Horario de atención</h3>
          <p>
            Lunes a sábado, de 8 de la mañana a 8 de la noche. Domingos solo
            pedidos programados.
          </p>
        </div>
      </div>
    </section>
  );
}