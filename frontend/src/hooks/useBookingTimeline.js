import { useState, useEffect } from 'react';
import { getBookingTimeline } from '../api/client';

export function useBookingTimeline(bookingId) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let timerId = null;

    const fetchTimeline = (isPoll = false) => {
      if (!isPoll) setLoading(true);
      getBookingTimeline(bookingId)
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

    fetchTimeline();

    // Setup polling every 3 seconds as per Architecture.md
    timerId = setInterval(() => {
      fetchTimeline(true);
    }, 3000);

    // Listen to custom updates for interactive simulation
    const handleUpdate = () => {
      fetchTimeline(true);
    };
    window.addEventListener('dealerxp_update', handleUpdate);

    return () => {
      cancelled = true;
      clearInterval(timerId);
      window.removeEventListener('dealerxp_update', handleUpdate);
    };
  }, [bookingId]);

  return { data, error, loading };
}
