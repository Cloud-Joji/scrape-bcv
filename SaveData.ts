import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';

export const saveData = (filename: string, data: any) => {
  !existsSync(resolve(__dirname, 'data')) ? mkdirSync('data') : null;

  writeFile(resolve(__dirname, `data/${filename}.json`), JSON.stringify(data), {
    encoding: 'utf8',
  });
}