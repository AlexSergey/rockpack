import axios from 'axios';
import { useEffect, useState } from 'react';

export const useRockpack = (): [boolean, boolean, string] => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    axios
      .get('https://api.github.com/repos/AlexSergey/rockpack')
      .then(({ data }) => {
        setLoading(false);
        setError(false);
        setDescription(data.description);
      })
      .catch(() => setError(true));
  }, []);

  return [loading, error, description];
};
