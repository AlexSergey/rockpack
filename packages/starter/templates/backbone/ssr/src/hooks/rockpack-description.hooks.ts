import { useRegisterEffect, useSsrEffect, useSsrState } from '@issr/core';
import axios from 'axios';

export const useRockpack = (): [boolean, boolean, string] => {
  const effect = useRegisterEffect();
  const [loading, setLoading] = useSsrState(true);
  const [error, setError] = useSsrState(false);
  const [description, setDescription] = useSsrState('');

  useSsrEffect(() => {
    effect(async () => {
      try {
        const { data } = await axios.get('https://api.github.com/repos/AlexSergey/rockpack');
        setLoading(false);
        setError(false);
        setDescription(data.description);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setError(true);
      }
    });
  }, []);

  return [loading, error, description];
};
