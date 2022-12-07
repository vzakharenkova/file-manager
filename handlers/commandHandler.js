import { getCurrentLocationMsg } from '../shared/messages.js';
import path from 'path';

import { nwd } from './nwd.js';

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

    default: {
      readLine.write(`\r\nUnknown command: ${input}\r\n`);

      askForCommand();
    }
  }
};
