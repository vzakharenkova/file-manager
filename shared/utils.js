import { fileURLToPath } from 'url';
import path from 'path';

export const getDirname = (url) => {
  return path.dirname(getFilename(url));
};

export const getFilename = (url) => fileURLToPath(url);
