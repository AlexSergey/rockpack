import { useRegisterEffect, useSsrEffect, useSsrState } from '@issr/core';

import { fetchRockpackDescription } from '../api/rockpack.api';

export const useRockpack = (): [boolean, boolean, string] => {
  const effect = useRegisterEffect();
  const [loading, setLoading] = useSsrState(true);
  const [error, setError] = useSsrState(false);
  const [description, setDescription] = useSsrState('');

  useSsrEffect(() => {
    void effect(async () => {
      try {
        const description = await fetchRockpackDescription();
        setLoading(false);
        setError(false);
        setDescription(description);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setError(true);
      }
    });
  }, []);

  return [loading, error, description];
};
