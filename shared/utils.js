import { fileURLToPath } from 'url';
import path from 'path';
import child_process from 'child_process';
import { stat } from 'fs/promises';

export const OS_ARGS = {
  EOL: '--EOL',
  CPUS: '--cpus',
  HOMEDIR: '--homedir',
  USERNAME: '--username',
  ARCHITECTURE: '--architecture',
};

export const COMMANDS = {
  EXIT: {
    command: '.exit',
    arguments: '',
    description: 'exit from file manager',
  },
  COMMANDS_LIST: {
    command: 'cl',
    arguments: '',
    description: 'display list of available commands',
  },
  GO_UPPER: {
    command: 'up',
    arguments: '',
    description: 'go upper from current directory',
  },
  CHANGE_DIRECTORY: {
    command: 'cd',
    arguments: 'path_to_directory',
    description: 'go to dedicated folder from current directory',
  },
  LIST_CONTENT: {
    command: 'ls',
    arguments: '',
    description: 'print list of all files and folders in current directory',
  },
  READ_FILE: {
    command: 'cat',
    arguments: 'path_to_file',
    description: "read file and print it's content",
  },
  ADD_FILE: {
    command: 'add',
    arguments: 'new_file_name',
    description: 'create empty file in current working directory',
  },
  RENAME_FILE: {
    command: 'rn',
    arguments: 'path_to_file new_filename',
    description: 'rename file',
  },
  COPY_FILE: {
    command: 'cp',
    arguments: 'path_to_file path_to_new_directory',
    description: 'copy file ',
  },
  MOVE_FILE: {
    command: 'mv',
    arguments: 'path_to_file path_to_new_directory',
    description: 'move file',
  },
  DELETE_FILE: {
    command: 'rm',
    arguments: 'path_to_file',
    description: 'delete file',
  },
  OPERATING_SYSTEM: {
    command: 'os',
    arguments: [
      { arg: OS_ARGS.EOL, description: 'get EOL (default system End-Of-Line)' },
      { arg: OS_ARGS.CPUS, description: 'get host machine CPUs info' },
      { arg: OS_ARGS.HOMEDIR, description: 'get home directory' },
      { arg: OS_ARGS.USERNAME, description: 'get current system user name' },
      {
        arg: OS_ARGS.ARCHITECTURE,
        description:
          'get CPU architecture for which Node.js binary has compiled',
      },
    ],
    description: 'operating system info',
  },
  HASH: {
    command: 'hash',
    arguments: 'path_to_file',
    description: 'calculate hash for file',
  },
  COMPRESS: {
    command: 'compress',
    arguments: 'path_to_file path_to_destination',
    description: 'compress file (using Brotli algorithm)',
  },
  DECOMPRESS: {
    command: 'decompress',
    arguments: 'path_to_file path_to_destination',
    description: 'decompress file (using Brotli algorithm)',
  },
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

export const resolveOneArg = (argsStr) => {
  return argsStr.replace(/["']/g, '');
};

export const resolveTwoArgs = (argsStr) => {
  let path_1;
  let path_2;
  const re = new RegExp(/\s+(?=(?:"[^"']*"|[^"'])*$)/);
  let arr = argsStr.split(re);
  arr = arr.map((item) => resolveOneArg(item));
  if (arr.length < 2) {
    console.log(red('You should pass 2 args!'));
    process.exit();
  }
  path_1 = path.resolve(arr[0]);
  path_2 = path.resolve(arr[1]);

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
