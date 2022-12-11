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
const [sourceFile, destinationFolder] = resolveTwoArgs(argsStr);

await stat(destinationFolder)
  .then((value) => value.isDirectory())
  .then(async (value) => {
    if (!value)
      throw new Error(`${destinationFolder} is not existing directory!`);
    await executeCommand(command);
  })
  .catch((error) => console.log(createErrorMsg(error)));

async function executeCommand(command) {
  const destinationFile = path.resolve(
    destinationFolder,
    path.parse(sourceFile).base
  );

  let readable;
  let writable;
  let brotli;
  let successMsg;

  switch (command) {
    case COMMANDS.COMPRESS.command: {
      await stat(sourceFile)
        .then((value) => value.isFile())
        .then((value) => {
          if (!value) {
            const error = new Error(`${sourceFile} is not a file!`);
            console.log(createErrorMsg(error));
            process.exit();
          }
          readable = createReadStream(sourceFile);
          const destinationFileWithExt = destinationFile + '.br';
          writable = createWriteStream(destinationFileWithExt, {
            flags: 'wx',
          });
          brotli = createBrotliCompress();
          successMsg = 'File compressed\r\n';
        })
        .catch((error) => {
          console.log(createErrorMsg(error));
          process.exit();
        });

      break;
    }

    case COMMANDS.DECOMPRESS.command: {
      if (path.extname(sourceFile) === '.br') {
        let modifiedDestinationFile = destinationFile.replace(/.br$/, '');
        path.extname(modifiedDestinationFile)
          ? modifiedDestinationFile
          : modifiedDestinationFile + '.txt';
        readable = createReadStream(sourceFile);
        writable = createWriteStream(modifiedDestinationFile, { flags: 'wx' });
        brotli = createBrotliDecompress();
        successMsg = 'File decompressed';
      } else {
        const error = new Error('Source file must have .br extension!');
        console.log(createErrorMsg(error));
        process.exit();
      }

      break;
    }

    default: {
      console.log(red('Smth went wrong. Please, try again.'));
      process.exit();
    }
  }

  pipeline(readable, brotli, writable, (error) => {
    if (error) {
      console.log(createErrorMsg(error));
      process.exit();
    }
    console.log(green(successMsg));
  });
}
