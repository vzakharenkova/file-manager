import { createHash } from 'node:crypto';
import { createReadStream } from 'fs';
import path from 'path';

const pathToFile = path.resolve(process.argv[3]);
const stream = createReadStream(pathToFile);

stream.on('data', (chunk) =>
  process.stdout.write(
    createHash('sha256').update(chunk).digest('hex') + '\r\n'
  )
);

stream.on('error', (error) => process.stdout.write(error.message + '\r\n'));
