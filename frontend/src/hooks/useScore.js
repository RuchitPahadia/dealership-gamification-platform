import { useState, useEffect } from 'react';
import { getUserScore } from '../api/client';

export function useScore(userId) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchScore = () => {
      getUserScore(userId)
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

    fetchScore();

    // Listen to custom updates for interactive simulation
    const handleUpdate = () => {
      fetchScore();
    };
    window.addEventListener('dealerxp_update', handleUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener('dealerxp_update', handleUpdate);
    };
  }, [userId]);

  return { data, error, loading };
}
