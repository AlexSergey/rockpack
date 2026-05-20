import { renderHook, waitFor } from '@testing-library/react';

import { fetchRockpackDescription } from '../api/rockpack.api';
import { useRockpack } from './rockpack-description.hooks';

jest.mock('../api/rockpack.api');

const mockFetch = fetchRockpackDescription as jest.MockedFunction<typeof fetchRockpackDescription>;

describe('useRockpack', () => {
  describe('positive cases', () => {
    it('returns description on success', async () => {
      mockFetch.mockResolvedValueOnce('Lorem ipsum');

      const { result } = renderHook(() => useRockpack());

      await waitFor(() => {
        expect(result.current[2]).toBe('Lorem ipsum');
      });

      const [loading, error, description] = result.current;

      expect(loading).toBe(false);
      expect(error).toBe(false);
      expect(description).toBe('Lorem ipsum');
    });
  });
});
