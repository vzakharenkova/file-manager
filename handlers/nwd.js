import { homedir } from 'os';
import { readdir, stat } from 'node:fs/promises';
import { dirNotExistMsg, changeDirErrMsg } from '../shared/messages.js';

export const nwd = async (
  command,
  writeLocationMsg,
  askForCommand,
  readLine,
  newDir
) => {
  switch (command) {
    case 'up': {
      if (process.cwd() === homedir()) {
        process.stdout.write(changeDirErrMsg);
      } else {
        process.chdir('../');
      }

      break;
    }

    case 'cd': {
      if (newDir.startsWith(homedir())) {
        try {
          process.chdir(newDir);
        } catch (err) {
          readLine.write(dirNotExistMsg);
        }
      } else {
        readLine.write(changeDirErrMsg);
      }

      break;
    }

    case 'ls': {
      try {
        const content = await readdir(process.cwd()).then((items) =>
          Promise.all(
            items.map(
              async (item) =>
                await stat(item).then((data) => {
                  return {
                    Name: item,
                    Type: data.isDirectory() ? 'directory' : 'file',
                  };
                })
            )
          )
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
        console.error(error);
      }

      break;
    }
  }

  writeLocationMsg();
  askForCommand();
};
