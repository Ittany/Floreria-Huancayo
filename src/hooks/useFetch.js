import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';


export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const recargar = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    // AbortController: si el componente se desmonta o cambian las deps,
    // cancelamos la petición pendiente).
    const controller = new AbortController();
    let activo = true; // bandera extra de seguridad

    const cargar = async () => {
      try {
        setLoading(true);
        setError(null);

        const resultado = await fetcher(controller.signal);

        if (activo) setData(resultado);
      } catch (err) {
        // Si la cancelamos nosotros, NO es un error reaL.
        if (axios.isCancel(err) || err.name === 'CanceledError') return;

        if (activo) {
          setError(
            err.response
              ? `Error ${err.response.status}: ${err.response.statusText}`
              : 'No pudimos conectar con la florería. Revisa tu conexión.'
          );
        }
      } finally {
        if (activo) setLoading(false); 
      }
    };

    cargar();

    // CLEANUP
    return () => {
      activo = false;
      controller.abort();
    };
  }, [...deps, reloadKey]);

  return { data, loading, error, recargar };
}