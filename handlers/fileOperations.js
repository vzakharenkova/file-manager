import { createReadStream, createWriteStream } from 'fs';
import { open, rename, access, unlink } from 'fs/promises';
import path from 'path';
import { resolveTwoArgs } from '../shared/utils.js';

const command = process.argv[2];

switch (command) {
  case 'cat': {
    const pathToFile = path.resolve(process.argv[3]);
    const stream = createReadStream(pathToFile);

    stream.on('data', (chunk) => process.stdout.write(chunk + '\r\n'));

    break;
  }

  case 'add': {
    const fileName = process.argv[3];

    await open(fileName, 'ax')
      .then((_val) =>
        process.stdout.write('File created: ' + fileName + '\r\n')
      )
      .catch((_err) =>
        process.stdout.write('File exists: ' + fileName + '\r\n')
      );

    break;
  }

  case 'rn': {
    const argsStr = process.argv[3];
    const [pathToOldFile, pathToNewFile] = resolveTwoArgs(argsStr);

    try {
      await access(pathToNewFile);
      process.stdout.write('File exists: ' + pathToNewFile + '\r\n');
    } catch {
      await rename(pathToOldFile, pathToNewFile)
        .then((_val) => process.stdout.write('File renamed\r\n'))
        .catch((err) => process.stdout.write(err.message + '\r\n'));
    }

    break;
  }

  case 'cp': {
    const argsStr = process.argv[3];
    const [sourceFile, destinationFolder] = resolveTwoArgs(argsStr);

    const destination = path.resolve(
      destinationFolder,
      path.parse(sourceFile).base
    );

    try {
      await access(destination);
      process.stdout.write('File already exists: ' + destination + '\r\n');
      process.exit();
    } catch {
      const readable = createReadStream(sourceFile);
      const writable = createWriteStream(destination);

      readable.on('error', (err) => {
        process.stdout.write(err.message + '\r\n');
        process.exit();
      });

      readable
        .pipe(writable)
        .on('finish', () => process.stdout.write('File copied\r\n'));
    }

    break;
  }

  case 'mv': {
    const argsStr = process.argv[3];
    const [sourceFile, destinationFolder] = resolveTwoArgs(argsStr);

    const destination = path.resolve(
      destinationFolder,
      path.parse(sourceFile).base
    );

    try {
      await access(destination);
      process.stdout.write('File already exists: ' + destination + '\r\n');
      process.exit();
    } catch {
      const readable = createReadStream(sourceFile);
      const writable = createWriteStream(destination);

      readable.on('error', (err) => {
        process.stdout.write(err.message + '\r\n');
        process.exit();
      });

      readable.pipe(writable).on('finish', async () => {
        await unlink(sourceFile)
          .then((_val) =>
            process.stdout.write(`File moved to ${destinationFolder}\r\n`)
          )
          .catch((err) => process.stdout.write(err.message));
      });
    }

    break;
  }

  case 'rm':
    {
      const pathToFile = path.resolve(process.argv[3]);

      await unlink(pathToFile)
        .then((_val) => process.stdout.write(`File removed\r\n`))
        .catch((err) => process.stdout.write(err.message + '\r\n'));
    }

    break;

  default: {
    process.stdout.write('Smth went wrong. Please, try again.\r\n');
  }
}
