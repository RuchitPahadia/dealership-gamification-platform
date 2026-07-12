import { useState, useEffect } from 'react';
import { getCurrentDuest } from '../api/client';

export function useDuel() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchDuel = () => {
      getCurrentDuest()
        .then(res => {
          if (!cancelled) {
            setData(res);
            setLoading(false);
          }
        })
        .catch(err => {
          if (!cancelled) {
            setError(err);
            setLoading(false);
          }
        });
    };

    fetchDuel();

    const handleUpdate = () => {
      fetchDuel();
    };
    window.addEventListener('dealerxp_update', handleUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener('dealerxp_update', handleUpdate);
    };
  }, []);

  return { data, error, loading };
}
