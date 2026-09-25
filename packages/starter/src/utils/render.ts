// Fills the `{{key}}` placeholders of a template; an unknown key throws, so a typo in a template never ships.
export const render = (template: string, values: Readonly<Record<string, string>>): string =>
  template.replace(/\{\{(\w+)\}\}/g, (_placeholder, key: string) => {
    const value = values[key];
    if (value === undefined) {
      throw new Error(`Unknown template placeholder {{${key}}}`);
    }

    return value;
  });
