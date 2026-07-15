import { useState, useEffect } from 'react';
import { getLeaderboard } from '../api/client';

export function useLeaderboard(scope) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const fetchLeaderboard = () => {
      getLeaderboard(scope)
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

    fetchLeaderboard();

    const handleUpdate = () => {
      fetchLeaderboard();
    };
    window.addEventListener('dealerxp_update', handleUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener('dealerxp_update', handleUpdate);
    };
  }, [scope]);

  return { data, error, loading };
}
