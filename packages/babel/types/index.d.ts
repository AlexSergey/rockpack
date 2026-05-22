import { createBabelPresetsWithRequire } from './create-presets';
export type { CreateBabelPresetsOptions } from './create-presets';
export declare const createBabelPresets: (options: Parameters<typeof createBabelPresetsWithRequire>[1]) => import("@babel/core").TransformOptions;
