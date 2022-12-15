import os from 'os';
import { createInputErrorMsg, green, OS_ARGS } from '../shared/utils.js';

const arg = process.argv[3];

switch (arg) {
  case OS_ARGS.EOL: {
    console.log(green(`system End-Of-Line: ${JSON.stringify(os.EOL)}`));

    break;
  }

  case OS_ARGS.CPUS: {
    const CPUsInfo = os.cpus();

    console.log(green(`Amount of CPUS: ${CPUsInfo.length}`));

    CPUsInfo.forEach((cpu) =>
      console.log(
        green(`Model: ${cpu.model}, clock rate: ${cpu.speed / 1000}GHz`)
      )
    );

    break;
  }

  case OS_ARGS.HOMEDIR: {
    console.log(green(`Home directory: ${os.homedir()}`));

    break;
  }

  case OS_ARGS.USERNAME: {
    console.log(green(`Username: ${os.userInfo().username}`));

    break;
  }

  case OS_ARGS.ARCHITECTURE: {
    console.log(green(`CPU architecture: ${os.arch()}\r\n`));

    break;
  }

  default: {
    const error = new Error(`unknown argument '${arg}'`);
    console.log(createInputErrorMsg(error));
  }
}
