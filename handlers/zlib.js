import { access, stat } from 'fs/promises';
import { pipeline } from 'stream';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { createReadStream, createWriteStream } from 'fs';
import {
  COMMANDS,
  createErrorMsg,
  green,
  red,
  resolveTwoArgs,
} from '../shared/utils.js';
import path from 'path';

const command = process.argv[2];
const argsStr = process.argv[3];
const [sourceFile, destinationFile] = resolveTwoArgs(argsStr);

const destinationFolder = path.parse(destinationFile).dir;

await access(sourceFile)
  .then(
    async () =>
      await stat(sourceFile)
        .then((value) => value.isFile())
        .then((value) => {
          if (!value) {
            throw new Error();
          }
        })
  )
  .catch(() => {
    console.log(createErrorMsg(new Error(`${sourceFile} is not exist!`)));
    process.exit();
  });

await stat(destinationFolder)
  .then((value) => value.isDirectory())
  .then(async (value) => {
    if (!value)
      throw new Error(`${destinationFolder} is not existing directory!`);
    await executeCommand(command);
  })
  .catch((error) =>
    error.message.includes('ENOENT')
      ? console.log(
          createErrorMsg(
            new Error(`${destinationFolder} is not existing directory!`)
          )
        )
      : console.log(createErrorMsg(error))
  );

async function executeCommand(command) {
  let readable;
  let writable;
  let brotli;
  let successMsg;

  switch (command) {
    case COMMANDS.COMPRESS.command: {
      if (path.extname(destinationFile) !== '.br') {
        throw new Error('Destination file must have .br extension!');
      }

      readable = createReadStream(sourceFile);
      writable = createWriteStream(destinationFile, { flags: 'wx' });
      brotli = createBrotliCompress();
      successMsg = 'File compressed';

      break;
    }

    case COMMANDS.DECOMPRESS.command: {
      if (path.extname(sourceFile) !== '.br') {
        throw new Error('Source file must have .br extension!');
      }

      readable = createReadStream(sourceFile);
      writable = createWriteStream(destinationFile, { flags: 'wx' });
      brotli = createBrotliDecompress();
      successMsg = 'File decompressed';

      break;
    }

    default: {
      console.log(red('Smth went wrong. Please, try again.'));
      process.exit();
    }
  }

  pipeline(readable, brotli, writable, (error) => {
    if (error) {
      error.message.includes('EEXIST')
        ? console.log(
            createErrorMsg(new Error(`${destinationFile} already exists!`))
          )
        : console.log(createErrorMsg(error));
      process.exit();
    }
    console.log(green(successMsg));
  });
}
