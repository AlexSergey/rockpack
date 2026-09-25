declare module 'deep-extend' {
  function deepExtend(target: object, ...sources: readonly object[]): Record<string, unknown>;
  export = deepExtend;
}

declare module 'validate-npm-package-name' {
  type ValidationResult = {
    errors?: string[];
    validForNewPackages: boolean;
    validForOldPackages: boolean;
    warnings?: string[];
  };
  function validate(name: string): ValidationResult;
  export = validate;
}
