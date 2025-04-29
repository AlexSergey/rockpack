import { useRegisterEffect, useSsrEffect, useSsrState } from '@issr/core';
import axios from 'axios';

export const useRockpack = (): [boolean, boolean, string] => {
  const effect = useRegisterEffect();
  const [loading, setLoading] = useSsrState(true);
  const [error, setError] = useSsrState(false);
  const [description, setDescription] = useSsrState('');

  useSsrEffect(() => {
    effect(async () => {
      const { data } = await axios.get('https://api.github.com/repos/AlexSergey/rockpack');
      setLoading(false);
      setError(false);
      setDescription(data.description);
    });
  }, []);

  return [loading, error, description];
};
