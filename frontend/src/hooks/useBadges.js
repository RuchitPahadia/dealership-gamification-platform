import { useState, useEffect } from 'react';
import { getUserBadges } from '../api/client';

export function useBadges(userId) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchBadges = () => {
      getUserBadges(userId)
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

    fetchBadges();

    const handleUpdate = () => {
      fetchBadges();
    };
    window.addEventListener('dealerxp_update', handleUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener('dealerxp_update', handleUpdate);
    };
  }, [userId]);

  return { data, error, loading };
}
