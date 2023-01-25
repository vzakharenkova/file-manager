import { open } from 'fs/promises';
import { green, createErrorMsg } from '../../shared/utils.js';

const fileName = process.argv[3];

await open(fileName, 'ax')
  .then((_val) => console.log(green('File created: ' + fileName)))
  .catch((error) =>
    error.message.includes('EEXIST')
      ? console.log(createErrorMsg(new Error('file already exists!')))
      : console.log(createErrorMsg(error))
  );
