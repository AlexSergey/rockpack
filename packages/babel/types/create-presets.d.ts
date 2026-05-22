import type { TransformOptions } from '@babel/core';
export interface CreateBabelPresetsOptions {
    readonly framework?: Framework;
    readonly isNodejs?: boolean;
    readonly isTest?: boolean;
    readonly modules?: Modules;
    readonly presetsAdditionalOptions?: Readonly<Record<string, Record<string, unknown>>>;
    readonly typescript?: boolean;
}
type Framework = 'none' | 'react';
type Modules = 'amd' | 'auto' | 'cjs' | 'commonjs' | 'systemjs' | 'umd' | false;
export declare const createBabelPresetsWithRequire: (_require: NodeRequire, { framework, isNodejs, isTest, modules, presetsAdditionalOptions, typescript, }: CreateBabelPresetsOptions) => TransformOptions;
export {};
