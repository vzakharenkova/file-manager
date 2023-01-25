import { createReadStream } from 'fs';
import path from 'path';
import { createErrorMsg, green } from '../../shared/utils.js';

const pathToFile = path.resolve(process.argv[3]);
const stream = createReadStream(pathToFile);

stream
  .on('data', (chunk) => console.log(green(chunk)))
  .on('error', (error) =>
    error.message.includes('EISDIR')
      ? console.log(createErrorMsg(new Error(`${pathToFile} is not a file!`)))
      : console.log(createErrorMsg(error))
  );
