import { rename, access } from 'fs/promises';
import { createErrorMsg, green, resolveTwoArgs } from '../../shared/utils.js';

const argsStr = process.argv[3];
const [pathToOldFile, pathToNewFile] = resolveTwoArgs(argsStr);

try {
  await access(pathToNewFile).then(() => {
    const error = new Error(`file ${pathToNewFile} already exists!`);
    console.log(createErrorMsg(error));
  });
} catch {
  await rename(pathToOldFile, pathToNewFile)
    .then(() => console.log(green('Renamed successfully')))
    .catch((error) =>
      error.message.includes('ENOENT')
        ? console.log(
            createErrorMsg(new Error(`${pathToOldFile} is not exist!`))
          )
        : console.log(createErrorMsg(error))
    );
}
