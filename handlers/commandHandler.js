import { getCurrentLocationMsg } from '../shared/messages.js';
import path from 'path';

import { nwd } from './nwd.js';
// import { fileOperations } from './fileOperations.js';

export const commandHandler = async (
  readLine,
  input,
  dirname,
  askForCommand
) => {
  const writeLocationMsg = () => readLine.write(getCurrentLocationMsg());

  switch (true) {
    case input === '.exit': {
      readLine.emit('SIGINT');
      break;
    }

    case input === 'gcl': {
      const child_process = await import('child_process');
      const cp = child_process.fork(path.join(dirname, '/handlers/gcl.js'));

      cp.on('exit', () => {
        writeLocationMsg();
        askForCommand();
      });

      break;
    }

    case input === 'up': {
      await nwd('up', writeLocationMsg, askForCommand, null, null);

      break;
    }

    case input.startsWith('cd '): {
      const newDir = path.resolve(input.slice(3));

      await nwd('cd', writeLocationMsg, askForCommand, readLine, newDir);

      break;
    }

    case input === 'ls': {
      await nwd('ls', writeLocationMsg, askForCommand);

      break;
    }

    case input.startsWith('cat '): {
      const argsStr = input.slice(4);
      const child_process = await import('child_process');
      const cp = child_process.fork(
        path.join(dirname, '/handlers/fileOperations.js'),
        ['cat', argsStr]
      );

      cp.on('exit', () => {
        writeLocationMsg();
        askForCommand();
      });

      //   fileOperations(
      //     'cat',
      //     writeLocationMsg,
      //     askForCommand,
      //     readLine,
      //     pathToFile
      //   );

      break;
    }

    case input.startsWith('add '): {
      const fileName = input.slice(4);

      const child_process = await import('child_process');
      const cp = child_process.fork(
        path.join(dirname, '/handlers/fileOperations.js'),
        ['add', fileName]
      );

      cp.on('exit', () => {
        writeLocationMsg();
        askForCommand();
      });

      break;
    }

    case input.startsWith('rn '): {
      const argsStr = input.slice(3);

      const child_process = await import('child_process');
      const cp = child_process.fork(
        path.join(dirname, '/handlers/fileOperations.js'),
        ['rn', argsStr]
      );

      cp.on('exit', () => {
        writeLocationMsg();
        askForCommand();
      });

      break;
    }

    case input.startsWith('cp '): {
      const argsStr = input.slice(3);

      const child_process = await import('child_process');
      const cp = child_process.fork(
        path.join(dirname, '/handlers/fileOperations.js'),
        ['cp', argsStr]
      );

      cp.on('exit', () => {
        writeLocationMsg();
        askForCommand();
      });

      break;
    }

    case input.startsWith('mv '): {
      const argsStr = input.slice(3);

      const child_process = await import('child_process');
      const cp = child_process.fork(
        path.join(dirname, '/handlers/fileOperations.js'),
        ['mv', argsStr]
      );

      cp.on('exit', () => {
        writeLocationMsg();
        askForCommand();
      });

      break;
    }

    case input.startsWith('rm '): {
      const argsStr = input.slice(3);

      const child_process = await import('child_process');
      const cp = child_process.fork(
        path.join(dirname, '/handlers/fileOperations.js'),
        ['rm', argsStr]
      );

      cp.on('exit', () => {
        writeLocationMsg();
        askForCommand();
      });

      break;
    }

    default: {
      readLine.write(`\r\nUnknown command: ${input}\r\n`);

      askForCommand();
    }
  }
};
