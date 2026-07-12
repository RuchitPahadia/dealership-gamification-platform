import { useState, useEffect } from 'react';
import { getDailyQuests } from '../api/client';

export function useQuests() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchQuests = () => {
      getDailyQuests()
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

    fetchQuests();

    const handleUpdate = () => {
      fetchQuests();
    };
    window.addEventListener('dealerxp_update', handleUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener('dealerxp_update', handleUpdate);
    };
  }, []);

  return { data, error, loading };
}
