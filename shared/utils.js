import { fileURLToPath } from 'url';
import path from 'path';

export const getDirname = (url) => {
  return path.dirname(getFilename(url));
};

export const getFilename = (url) => fileURLToPath(url);

export const resolveTwoArgs = (argsStr) => {
  let path_1;
  let path_2;
  if (!argsStr.includes("'") || !argsStr.includes('"')) {
    const arr = argsStr.split(' ');
    if (arr.length < 2) {
      process.stdout.write('You should pass 2 args');
      process.exit();
    }
    path_1 = path.resolve(arr[0]);
    path_2 = path.resolve(arr[1]);
  }
  // else {
  //     if (argsStr.startsWith("'") || argsStr.startsWith('"')) {

  //     }
  // }

  return [path_1, path_2];
};
