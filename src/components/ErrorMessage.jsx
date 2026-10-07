export default function ErrorMessage({ mensaje, onReintentar }) {
  return (
    <div className="estado estado--error" role="alert">
      <p>⚠️ {mensaje}</p>
      {onReintentar && (
        <button className="btn btn--outline" onClick={onReintentar}>
          Reintentar
        </button>
      )}
    </div>
  );
}