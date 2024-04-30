import fs from 'fs';
import { resolve } from 'path';

export const jsonLoader = (): Record<string, never> => {
  try {
    const env = fs.readFileSync(resolve(process.cwd(), 'env.json'), {
      encoding: 'utf8',
    });

    const parsedEnv = JSON.parse(env);

    return parsedEnv;
  }
  catch (e) {
    console.error(e);
    console.trace(e);
    return {};
  }
};
