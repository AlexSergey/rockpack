import { render } from './render.js';

describe('render', () => {
  describe('negative cases', () => {
    it('throws on a placeholder without a value', () => {
      expect(() => render('{{name}} by {{author}}', { name: 'App' })).toThrow(
        'Unknown template placeholder {{author}}',
      );
    });

    it('leaves text that is not a placeholder as it is', () => {
      expect(render('{ name } {{ name }} %name%', { name: 'App' })).toBe('{ name } {{ name }} %name%');
    });
  });

  describe('positive cases', () => {
    it('fills every placeholder with its value', () => {
      expect(render("name: '{{name}}', title: '{{name}} {{version}}'", { name: 'App', version: '1.0.0' })).toBe(
        "name: 'App', title: 'App 1.0.0'",
      );
    });
  });
});
