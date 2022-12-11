import { createReadStream, createWriteStream } from 'fs';
import { unlink } from 'fs/promises';
import path from 'path';

import {
  checkPathToItemType,
  COMMANDS,
  createErrorMsg,
  green,
  red,
  resolveTwoArgs,
} from '../../shared/utils.js';

const command = process.argv[2];
const argsStr = process.argv[3];
const [sourceFile, destinationFolder] = resolveTwoArgs(argsStr);

const correctType = 'file';
const isCorrectType = await checkPathToItemType(sourceFile, correctType);

if (!isCorrectType) {
  console.log(
    createErrorMsg(new Error(`${sourceFile} is not a ${correctType}!`))
  );
  process.exit();
}
const destination = path.resolve(
  destinationFolder,
  path.parse(sourceFile).base
);
const readable = createReadStream(sourceFile);
const writable = createWriteStream(destination, { flags: 'wx' });

readable.pipe(writable);

switch (command) {
  case COMMANDS.COPY_FILE.command: {
    writable.on('finish', () => console.log(green('File copied')));

    break;
  }

  case COMMANDS.MOVE_FILE.command: {
    writable.on(
      'finish',
      async () =>
        await unlink(sourceFile)
          .then(() => console.log(green(`File moved to ${destinationFolder}`)))
          .catch((error) => console.log(createErrorMsg(error)))
    );

    break;
  }

  default: {
    console.log(red('Smth went wrong. Please, try again.'));
  }
}

writable.on('error', (error) => {
  if (error.message.includes('EEXIST')) {
    console.log(createErrorMsg(new Error('file already exists!')));
    process.exit();
  }
  console.log(createErrorMsg(error));
});

readable.on('error', (error) => {
  if (error.message.includes('EISDIR')) {
    console.log(createErrorMsg(new Error(`${sourceFile} is not a file!`)));
    process.exit();
  }
  if (error.message.includes('ENOENT')) {
    console.log(createErrorMsg(new Error(`${sourceFile} is not exist!`)));
    process.exit();
  }
  console.log(createErrorMsg(error));
});
