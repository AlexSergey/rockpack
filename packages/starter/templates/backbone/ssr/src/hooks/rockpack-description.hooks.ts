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
        const desc = await fetchRockpackDescription();
        setLoading(false);
        setError(false);
        setDescription(desc);
      } catch {
        setLoading(false);
        setError(true);
      }
    });
  }, []);

  return [loading, error, description];
};
