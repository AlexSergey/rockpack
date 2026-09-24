/**
 * @jest-environment node
 */
import { isNodeJS } from './index';

describe('isNodeJS in the node test environment', () => {
  describe('negative cases', () => {
    it('does not expose a browser document', () => {
      expect(typeof document).toBe('undefined');
    });
  });

  describe('positive cases', () => {
    it('detects Node.js', () => {
      expect(isNodeJS()).toBe(true);
    });
  });
});
