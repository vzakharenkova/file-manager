import path from 'path';

import { nwd } from './nwd.js';
import {
  COMMANDS,
  createChildProcess,
  createInputErrorMsg,
} from '../shared/utils.js';

export const commandHandler = async (
  readLine,
  input,
  dirname,
  askForCommand
) => {
  input = input.replace(/\s+/g, ' ').trim();

  switch (true) {
    case input === COMMANDS.CHANGE_DIRECTORY.command ||
      input === COMMANDS.READ_FILE.command ||
      input === COMMANDS.ADD_FILE.command ||
      input === COMMANDS.RENAME_FILE.command ||
      input === COMMANDS.COPY_FILE.command ||
      input === COMMANDS.MOVE_FILE.command ||
      input === COMMANDS.DELETE_FILE.command ||
      input === COMMANDS.OPERATING_SYSTEM.command ||
      input === COMMANDS.HASH.command ||
      input === COMMANDS.COMPRESS.command ||
      input === COMMANDS.DECOMPRESS.command: {
      console.log(
        createInputErrorMsg(
          new Error(`${input}. Mandatory arguments are missed.`)
        )
      );

      askForCommand();

      break;
    }

    case input === COMMANDS.EXIT.command: {
      readLine.emit('SIGINT');
      break;
    }

    case input === COMMANDS.COMMANDS_LIST.command: {
      createChildProcess(
        path.join(dirname, '/handlers/cl.js'),
        [],
        askForCommand
      );

      break;
    }

    case input === COMMANDS.GO_UPPER.command: {
      await nwd(COMMANDS.GO_UPPER.command, askForCommand, null);

      break;
    }

    case input.startsWith(`${COMMANDS.CHANGE_DIRECTORY.command} `): {
      const command = COMMANDS.CHANGE_DIRECTORY.command;
      const newDir = path.resolve(input.slice(command.length + 1));

      await nwd(command, askForCommand, newDir);

      break;
    }

    case input === COMMANDS.LIST_CONTENT.command: {
      await nwd(COMMANDS.LIST_CONTENT.command, askForCommand, null);

      break;
    }

    case input.startsWith(`${COMMANDS.READ_FILE.command} `): {
      const command = COMMANDS.READ_FILE.command;
      const argsStr = path.resolve(input.slice(command.length + 1));

      createChildProcess(
        path.join(dirname, '/handlers/fs/read.js'),
        [command, argsStr],
        askForCommand
      );

      break;
    }

    case input.startsWith(`${COMMANDS.ADD_FILE.command} `): {
      const command = COMMANDS.ADD_FILE.command;
      const fileName = path.resolve(input.slice(command.length + 1));

      createChildProcess(
        path.join(dirname, '/handlers/fs/add.js'),
        [command, fileName],
        askForCommand
      );

      break;
    }

    case input.startsWith(`${COMMANDS.RENAME_FILE.command} `): {
      const command = COMMANDS.RENAME_FILE.command;
      const argsStr = path.resolve(input.slice(command.length + 1));

      createChildProcess(
        path.join(dirname, '/handlers/fs/rename.js'),
        [command, argsStr],
        askForCommand
      );

      break;
    }

    case input.startsWith(`${COMMANDS.COPY_FILE.command} `): {
      const command = COMMANDS.COPY_FILE.command;
      const argsStr = path.resolve(input.slice(command.length + 1));

      createChildProcess(
        path.join(dirname, '/handlers/fs/copy_move.js'),
        [command, argsStr],
        askForCommand
      );

      break;
    }

    case input.startsWith(`${COMMANDS.MOVE_FILE.command} `): {
      const command = COMMANDS.MOVE_FILE.command;
      const argsStr = path.resolve(input.slice(command.length + 1));

      createChildProcess(
        path.join(dirname, '/handlers/fs/copy_move.js'),
        [command, argsStr],
        askForCommand
      );

      break;
    }

    case input.startsWith(`${COMMANDS.DELETE_FILE.command} `): {
      const command = COMMANDS.DELETE_FILE.command;
      const argsStr = path.resolve(input.slice(command.length + 1));

      createChildProcess(
        path.join(dirname, '/handlers/fs/delete.js'),
        [command, argsStr],
        askForCommand
      );

      break;
    }

    case input.startsWith(`${COMMANDS.OPERATING_SYSTEM.command} `): {
      const command = COMMANDS.OPERATING_SYSTEM.command;
      const arg = input.slice(command.length + 1);

      createChildProcess(
        path.join(dirname, '/handlers/os.js'),
        [command, arg],
        askForCommand
      );

      break;
    }

    case input.startsWith(`${COMMANDS.HASH.command} `): {
      const command = COMMANDS.HASH.command;
      const argsStr = path.resolve(input.slice(command.length + 1));

      createChildProcess(
        path.join(dirname, '/handlers/hash.js'),
        [command, argsStr],
        askForCommand
      );

      break;
    }

    case input.startsWith(`${COMMANDS.COMPRESS.command} `): {
      const command = COMMANDS.COMPRESS.command;
      const argsStr = path.resolve(input.slice(command.length + 1));

      createChildProcess(
        path.join(dirname, '/handlers/zlib.js'),
        [command, argsStr],
        askForCommand
      );

      break;
    }

    case input.startsWith(`${COMMANDS.DECOMPRESS.command} `): {
      const command = COMMANDS.DECOMPRESS.command;
      const argsStr = path.resolve(input.slice(command.length + 1));

      createChildProcess(
        path.join(dirname, '/handlers/zlib.js'),
        [command, argsStr],
        askForCommand
      );

      break;
    }

    default: {
      console.log(createInputErrorMsg(new Error(input)));

      askForCommand();
    }
  }
};
