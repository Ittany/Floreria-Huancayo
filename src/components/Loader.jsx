
export default function Loader({ texto = 'Cargando arreglos florales...' }) {
  return (
    <div className="estado estado--loading" role="status" aria-live="polite">
      <div className="spinner" />
      <p>{texto}</p>
    </div>
  );
}