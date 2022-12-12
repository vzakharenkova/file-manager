import { readdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import {
  COMMANDS,
  createErrorMsg,
  red,
  resolveOneArg,
} from '../shared/utils.js';

export const nwd = async (command, askForCommand, newDir) => {
  switch (command) {
    case COMMANDS.GO_UPPER.command: {
      try {
        process.chdir('../');
      } catch (error) {
        console.log(createErrorMsg(error));
      }

      break;
    }

    case COMMANDS.CHANGE_DIRECTORY.command: {
      newDir = resolveOneArg(newDir);
      if (newDir.startsWith(path.parse(homedir()).root)) {
        try {
          process.chdir(newDir);
        } catch (error) {
          error.message.includes('ENOENT')
            ? console.log(createErrorMsg(new Error(`${newDir} is not found.`)))
            : console.log(createErrorMsg(error));
        }
      }

      break;
    }

    case COMMANDS.LIST_CONTENT.command: {
      try {
        const content = await readdir(process.cwd(), {
          withFileTypes: true,
        }).then((items) =>
          items.map((item) => {
            return {
              Name: item.name,
              Type: item.isDirectory() ? 'directory' : 'file',
            };
          })
        );

        console.table(
          content.sort((a, b) => {
            if (a.Type === b.Type) {
              return a.Name.toLowerCase() < b.Name.toLowerCase() ? -1 : 1;
            }
            return a.Type === 'directory' ? -1 : 1;
          })
        );
      } catch (error) {
        console.log(createErrorMsg(error));
      }

      break;
    }

    default: {
      console.log(red('Smth went wrong. Please, try again.'));
    }
  }

  askForCommand();
};
