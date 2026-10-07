import { useState } from 'react';
import Swal from 'sweetalert2';
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

const DISTRITOS = [
  'Huancayo',
  'El Tambo',
  'Chilca',
  'San Agustín de Cajas',
  'Pilcomayo',
];

const ARREGLOS = [
  'Ramo de Rosas Rojas',
  'Box de Tulipanes',
  'Arreglo de Girasoles',
  'Orquídea Phalaenopsis',
  'Corona de Condolencia',
];

// Helpers de fecha --------------------------------------------------------

// Devuelve la fecha de hoy en formato YYYY-MM-DD (hora local, sin UTC).
const hoyISO = () => {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
};

// Fecha máxima permitida: 60 días desde hoy.
const fechaMaximaISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
};

// Convierte "2026-10-07" a "miércoles 07 de octubre de 2026".
const formatearFechaLarga = (iso) => {
  if (!iso) return '';
  // El T00:00:00 evita que la fecha se corra un día por zona horaria.
  const fecha = new Date(`${iso}T00:00:00`);
  return fecha.toLocaleDateString('es-PE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

// -------------------------------------------------------------------------

export default function Pedido() {
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  // Un solo handler para todos los inputs controlados
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // El teléfono solo acepta dígitos: filtramos mientras se escribe
    const valorFinal =
      name === 'telefono' ? value.replace(/\D/g, '') : type === 'checkbox' ? checked : value;

    setForm((prev) => ({ ...prev, [name]: valorFinal }));
    // Limpiamos el error del campo al escribir (mejor UX)
    setErrores((prev) => ({ ...prev, [name]: undefined }));
  };

  // Validación completa del formulario
  const validar = () => {
    const e = {};

    // Nombre: mínimo 3 letras, sin números
    const nombreLimpio = form.nombre.trim();
    if (nombreLimpio.length < 3) {
      e.nombre = 'Ingresa tu nombre completo (mínimo 3 letras).';
    } else if (/\d/.test(nombreLimpio)) {
      e.nombre = 'El nombre no puede llevar números.';
    }

    // Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) {
      e.email = 'Correo inválido. Ejemplo: maria@correo.com';
    }

    // Teléfono peruano: 9 dígitos, empieza en 9
    if (!/^9\d{8}$/.test(form.telefono)) {
      e.telefono = 'El teléfono debe tener 9 dígitos y empezar con 9.';
    }

    // Fecha: obligatoria, no pasada, no más de 60 días
    if (!form.fecha) {
      e.fecha = 'Elige la fecha de entrega.';
    } else {
      const elegida = new Date(`${form.fecha}T00:00:00`);
      const hoy = new Date(`${hoyISO()}T00:00:00`);
      const max = new Date(`${fechaMaximaISO()}T00:00:00`);

      if (elegida < hoy) {
        e.fecha = 'La fecha no puede ser anterior a hoy.';
      } else if (elegida > max) {
        e.fecha = 'Solo aceptamos pedidos hasta 60 días de anticipación.';
      } else if (elegida.getDay() === 0) {
        // 0 = domingo
        e.fecha = 'Los domingos solo atendemos pedidos programados. Elige otro día.';
      }
    }

    // Mensaje: opcional pero si escriben, mínimo 5 caracteres
    if (form.mensaje.trim().length > 0 && form.mensaje.trim().length < 5) {
      e.mensaje = 'La dedicatoria es muy corta (mínimo 5 caracteres).';
    }

    // Acepta política
    if (!form.acepta) {
      e.acepta = 'Debes aceptar la política de pedidos.';
    }

    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const errs = validar();
    setErrores(errs);

    // Si hay errores, mostramos un SweetAlert tipo toast y cortamos
    if (Object.keys(errs).length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Revisa el formulario',
        text: 'Hay campos con errores o incompletos. Los marcamos en rojo.',
        confirmButtonColor: '#d97a9a',
      });
      return;
    }

    // Confirmación antes de enviar (opcional, pero se ve profesional)
    const confirmacion = await Swal.fire({
      icon: 'question',
      title: '¿Confirmar pedido?',
      html: `
        <p style="text-align:left;margin:0 0 .5rem">
          <strong>Arreglo:</strong> ${form.arreglo}<br>
          <strong>Entrega:</strong> ${formatearFechaLarga(form.fecha)}<br>
          <strong>Distrito:</strong> ${form.distrito}<br>
          <strong>Teléfono:</strong> ${form.telefono}
        </p>
        <p style="color:#7b8a91;font-size:.85rem;margin:0">
          Revisa que los datos estén correctos.
        </p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Revisar de nuevo',
      confirmButtonColor: '#d97a9a',
      cancelButtonColor: '#8ecae6',
      reverseButtons: true,
    });

    if (!confirmacion.isConfirmed) return;

    try {
      setEnviando(true);

      // Loader mientras viaja la petición
      Swal.fire({
        title: 'Enviando pedido...',
        text: 'Estamos registrando tu solicitud.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });

      const respuesta = await crearPedido(form);

      // Éxito
      await Swal.fire({
        icon: 'success',
        title: 'Pedido registrado',
        html: `
          <p style="margin:0 0 .5rem">
            Tu código de pedido es <strong>#${respuesta.id}</strong>.
          </p>
          <p style="color:#7b8a91;font-size:.85rem;margin:0">
            Te contactaremos al ${form.telefono} para coordinar la entrega
            del ${formatearFechaLarga(form.fecha)}.
          </p>
        `,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#d97a9a',
      });

      setForm(ESTADO_INICIAL);
      setErrores({});
    } catch (err) {
      const esErrorDeServidor = Boolean(err.response);

      Swal.fire({
        icon: 'error',
        title: esErrorDeServidor ? 'El servidor rechazó el pedido' : 'Sin conexión',
        text: esErrorDeServidor
          ? `Código ${err.response.status}. Intenta de nuevo en unos minutos.`
          : 'Revisa tu internet e inténtalo otra vez.',
        confirmButtonText: 'Reintentar',
        confirmButtonColor: '#d97a9a',
      });
    } finally {
      setEnviando(false);
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
              autoComplete="name"
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
              autoComplete="email"
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
              inputMode="numeric"
              autoComplete="tel"
            />
            {errores.telefono && <small className="error">{errores.telefono}</small>}
          </label>

          <label className="form__field">
            <span>Distrito de entrega</span>
            <select
              className="input"
              name="distrito"
              value={form.distrito}
              onChange={handleChange}
            >
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
            <select
              className="input"
              name="arreglo"
              value={form.arreglo}
              onChange={handleChange}
            >
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
              min={hoyISO()}
              max={fechaMaximaISO()}
            />
            {errores.fecha && <small className="error">{errores.fecha}</small>}
          </label>
        </div>

        <label className="form__field">
          <span>Tarjeta dedicatoria</span>
          <textarea
            className={errores.mensaje ? 'input input--error' : 'input'}
            name="mensaje"
            rows={3}
            maxLength={200}
            value={form.mensaje}
            onChange={handleChange}
            placeholder="Escribe el mensaje que irá en la tarjeta..."
          />
          <small className="contador">{form.mensaje.length}/200</small>
          {errores.mensaje && <small className="error">{errores.mensaje}</small>}
        </label>

        <label className="form__check">
          <input
            type="checkbox"
            name="acepta"
            checked={form.acepta}
            onChange={handleChange}
          />
          <span>Acepto la política de pedidos y entregas de la florería *</span>
        </label>
        {errores.acepta && <small className="error">{errores.acepta}</small>}

        <button className="btn btn--primary btn--block" type="submit" disabled={enviando}>
          {enviando ? 'Enviando pedido...' : 'Confirmar pedido'}
        </button>

        {hayErrores && (
          <p className="form__resumen">
            Revisa los campos marcados antes de continuar.
          </p>
        )}
      </form>
    </section>
  );
}