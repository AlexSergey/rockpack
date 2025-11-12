import { stat } from 'node:fs/promises';

export async function exists(f: string): Promise<boolean> {
  try {
    await stat(f);

    return true;
  } catch {
    return false;
  }
}
