import { access } from 'fs/promises';
import { pipeline } from 'stream';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { createReadStream, createWriteStream } from 'fs';
import { resolveTwoArgs } from '../shared/utils.js';

const command = process.argv[2];
const argsStr = process.argv[3];
const [sourceFile, destinationFile] = resolveTwoArgs(argsStr);

try {
  await access(destinationFile);
  process.stdout.write('File already exists: ' + destinationFile + '\r\n');
} catch {
  const readable = createReadStream(sourceFile);
  const writable = createWriteStream(destinationFile);
  let brotli;
  let successMsg;

  switch (command) {
    case 'compress': {
      brotli = createBrotliCompress();
      successMsg = 'File compressed\r\n';
      break;
    }

    case 'decompress': {
      brotli = createBrotliDecompress();
      successMsg = 'File decompressed\r\n';

      break;
    }

    default: {
      process.stdout.write('Smth went wrong. Please, try again.\r\n');
      process.exit();
    }
  }

  readable.on('error', (err) => {
    process.stdout.write(err.message + '\r\n');
    process.exit();
  });

  pipeline(readable, brotli, writable, (error) => {
    if (error) {
      console.error('Pipeline failed.', error);
    }
  }).on('finish', () => process.stdout.write(successMsg));
}
