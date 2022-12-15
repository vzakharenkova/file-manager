import { unlink } from 'fs/promises';
import path from 'path';
import { createErrorMsg, green } from '../../shared/utils.js';

const pathToFile = path.resolve(process.argv[3]);

await unlink(pathToFile)
  .then(() => console.log(green('File removed')))
  .catch((error) =>
    error.message.includes('ENOENT')
      ? console.log(createErrorMsg(new Error(`${pathToFile} is not exist!`)))
      : console.log(createErrorMsg(error))
  );
