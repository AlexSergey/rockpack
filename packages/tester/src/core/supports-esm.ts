import vm from 'node:vm';

// vm.SourceTextModule exists only when Node.js runs with --experimental-vm-modules, which Jest needs for ES modules.
export const supportsEsm = (): boolean => 'SourceTextModule' in vm;
