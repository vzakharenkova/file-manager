import { createHash } from 'node:crypto';
import { createReadStream } from 'fs';
import path from 'path';
import { createErrorMsg, green, red } from '../shared/utils';

const pathToFile = path.resolve(process.argv[3]);
const stream = createReadStream(pathToFile);

stream
  .on('data', (chunk) =>
    console.log(
      green(createHash('sha256').update(chunk).digest('hex') + '\r\n')
    )
  )
  .on('error', (error) => red(console.log(createErrorMsg(error))));
