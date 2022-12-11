import { fileURLToPath } from 'url';
import path from 'path';
import child_process from 'child_process';
import { stat } from 'fs/promises';

export const COMMANDS = {
  EXIT: { command: '.exit', arguments: '' },
  COMMANDS_LIST: { command: 'cl', arguments: '' },
  GO_UPPER: { command: 'up', arguments: '' },
  CHANGE_DIRECTORY: { command: 'cd', arguments: '' },
  LIST_CONTENT: { command: 'ls', arguments: '' },
  READ_FILE: { command: 'cat', arguments: '' },
  ADD_FILE: { command: 'add', arguments: '' },
  RENAME_FILE: { command: 'rn', arguments: '' },
  COPY_FILE: { command: 'cp', arguments: '' },
  MOVE_FILE: { command: 'mv', arguments: '' },
  DELETE_FILE: { command: 'rm', arguments: '' },
  OPERATING_SYSTEM: { command: 'os', arguments: '' },
  HASH: { command: 'hash', arguments: '' },
  COMPRESS: { command: 'compress', arguments: '' },
  DECOMPRESS: { command: 'decompress', arguments: '' },
};

export const OS_ARGS = {
  EOL: '--EOL',
  CPUS: '--cpus',
  HOMEDIR: '--homedir',
  USERNAME: '--username',
  ARCHITECTURE: '--architecture',
};

export const getCurrentLocationMsg = () =>
  `You are currently in ${process.cwd()}\r\n`;

export const createErrorMsg = (error) => {
  const msg = 'Operation failed';

  if (!error) return red(msg);
  return red(`${msg}: ${error.message}`);
};

export const createInputErrorMsg = (error) => {
  const msg = 'Invalid input';
  if (!error) return red(msg);

  return red(`${msg}: ${error.message}`);
};

export const getDirname = (url) => {
  return path.dirname(getFilename(url));
};

export const getFilename = (url) => fileURLToPath(url);

export function green(str) {
  return `\x1b[32m${str}\x1b[0m`;
}

export function yellow(str) {
  return `\x1b[33m${str}\x1b[0m`;
}

export function red(str) {
  return `\x1b[31m${str}\x1b[0m`;
}

export function blue(str) {
  return `\x1b[36m${str}\x1b[0m`;
}

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

export const createChildProcess = (pathToScript, args, askForCommand) => {
  const cp = child_process.fork(pathToScript, args);

  cp.on('exit', () => {
    askForCommand();
  });
};

export const checkPathToItemType = async (path, typeToCheck) => {
  try {
    const result = await stat(path);

    return typeToCheck === 'file' ? result.isFile() : result.isDirectory();
  } catch {}
};
