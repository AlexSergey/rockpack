import { useEffect, useState } from 'react';

import { fetchRockpackDescription } from '../api/rockpack.api';

export const useRockpack = (): [boolean, boolean, string] => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchRockpackDescription()
      .then((desc) => {
        setLoading(false);
        setError(false);
        setDescription(desc);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  return [loading, error, description];
};
