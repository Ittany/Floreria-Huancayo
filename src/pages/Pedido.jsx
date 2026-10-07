import { useState } from 'react';
import { crearPedido } from '../services/floreriaApi';

const ESTADO_INICIAL = {
  nombre: '',
  email: '',
  telefono: '',
  distrito: 'Huancayo',
  arreglo: 'Ramo de Rosas Rojas',
  fecha: '',
  mensaje: '',
  acepta: false,
};

const DISTRITOS = ['Huancayo', 'El Tambo', 'Chilca', 'San Agustín de Cajas', 'Pilcomayo'];
const ARREGLOS = [
  'Ramo de Rosas Rojas',
  'Box de Tulipanes',
  'Arreglo de Girasoles',
  'Orquídea Phalaenopsis',
  'Corona de Condolencia',
];

export default function Pedido() {
  const [form, setForm] = useState(ESTADO_INICIAL);   // un solo objeto de estado
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(null);
  const [errorEnvio, setErrorEnvio] = useState(null);

  // Un solo handler para todos los inputs controlados
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

    // Limpiamos el error del campo mientras el usuario escribe (mejor UX)
    setErrores((prev) => ({ ...prev, [name]: undefined }));
  };

  const validar = () => {
    const e = {};
    if (form.nombre.trim().length < 3) e.nombre = 'Ingresa tu nombre completo.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Correo inválido.';
    if (!/^\d{9}$/.test(form.telefono)) e.telefono = 'El teléfono debe tener 9 dígitos.';
    if (!form.fecha) e.fecha = 'Elige la fecha de entrega.';
    if (!form.acepta) e.acepta = 'Debes aceptar la política de pedidos.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const errs = validar();
    setErrores(errs);
    if (Object.keys(errs).length > 0) return; // cortamos antes de llamar a la API

    try {
      setEnviando(true);
      setErrorEnvio(null);
      setExito(null);

      const respuesta = await crearPedido(form); // async/await, sin .then()
      setExito(respuesta);
      setForm(ESTADO_INICIAL); // reiniciamos el formulario
    } catch (err) {
      setErrorEnvio(
        err.response
          ? `El servidor rechazó el pedido (${err.response.status}). Intenta otra vez.`
          : 'Sin conexión. Revisa tu internet e inténtalo de nuevo.'
      );
    } finally {
      setEnviando(false); // el botón nunca se queda bloqueado
    }
  };

  const hayErrores = Object.keys(errores).length > 0;

  return (
    <section className="pedido">
      <h1>Hacer un pedido</h1>
      <p className="pedido__sub">
        Completa el formulario y coordinamos la entrega por WhatsApp.
      </p>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form__row">
          <label className="form__field">
            <span>Nombre completo *</span>
            <input
              className={errores.nombre ? 'input input--error' : 'input'}
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej. María Quispe"
            />
            {errores.nombre && <small className="error">{errores.nombre}</small>}
          </label>

          <label className="form__field">
            <span>Correo electrónico *</span>
            <input
              className={errores.email ? 'input input--error' : 'input'}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="maria@correo.com"
            />
            {errores.email && <small className="error">{errores.email}</small>}
          </label>
        </div>

        <div className="form__row">
          <label className="form__field">
            <span>Teléfono (9 dígitos) *</span>
            <input
              className={errores.telefono ? 'input input--error' : 'input'}
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="987654321"
              maxLength={9}
            />
            {errores.telefono && <small className="error">{errores.telefono}</small>}
          </label>

          <label className="form__field">
            <span>Distrito de entrega</span>
            <select className="input" name="distrito" value={form.distrito} onChange={handleChange}>
              {DISTRITOS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form__row">
          <label className="form__field">
            <span>Arreglo floral</span>
            <select className="input" name="arreglo" value={form.arreglo} onChange={handleChange}>
              {ARREGLOS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>

          <label className="form__field">
            <span>Fecha de entrega *</span>
            <input
              className={errores.fecha ? 'input input--error' : 'input'}
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
            />
            {errores.fecha && <small className="error">{errores.fecha}</small>}
          </label>
        </div>

        <label className="form__field">
          <span>Tarjeta dedicatoria</span>
          <textarea
            className="input"
            name="mensaje"
            rows={3}
            maxLength={200}
            value={form.mensaje}
            onChange={handleChange}
            placeholder="Escribe el mensaje que irá en la tarjeta..."
          />
          <small className="contador">{form.mensaje.length}/200</small>
        </label>

        <label className="form__check">
          <input type="checkbox" name="acepta" checked={form.acepta} onChange={handleChange} />
          <span>Acepto la política de pedidos y entregas de la florería *</span>
        </label>
        {errores.acepta && <small className="error">{errores.acepta}</small>}

        <button className="btn btn--primary btn--block" type="submit" disabled={enviando}>
          {enviando ? 'Enviando pedido...' : 'Confirmar pedido'}
        </button>

        {/* Mensajes de resultado: éxito / error de red */}
        {exito && (
          <div className="alerta alerta--ok" role="status">
            ✅ ¡Pedido registrado! Código <strong>#{exito.id}</strong>. Te contactaremos al{' '}
            {form.telefono || 'teléfono indicado'}.
          </div>
        )}

        {errorEnvio && (
          <div className="alerta alerta--error" role="alert">
            ⚠️ {errorEnvio}
          </div>
        )}

        {hayErrores && (
          <p className="form__resumen">Revisa los campos marcados en rojo antes de continuar.</p>
        )}
      </form>
    </section>
  );
}