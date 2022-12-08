import os from 'os';

const arg = process.argv[3];

switch (true) {
  case arg.startsWith('--EOL ') || arg === '--EOL': {
    process.stdout.write(`system End-Of-Line: ${JSON.stringify(os.EOL)}\r\n`);

    break;
  }

  case arg.startsWith('--cpus ') || arg === '--cpus': {
    const CPUsInfo = os.cpus();

    process.stdout.write(`Amount of CPUS: ${CPUsInfo.length}\r\n`);

    CPUsInfo.forEach((cpu) =>
      process.stdout.write(
        `Model: ${cpu.model}, clock rate: ${cpu.speed / 1000}GHz\r\n`
      )
    );

    break;
  }

  case arg.startsWith('--homedir ') || arg === '--homedir': {
    process.stdout.write(`Home directory: ${os.homedir()}\r\n`);

    break;
  }

  case arg.startsWith('--username ') || arg === '--username': {
    process.stdout.write(`Username: ${os.userInfo().username}\r\n`);

    break;
  }

  case arg.startsWith('--architecture ') || arg === '--architecture': {
    process.stdout.write(`CPU architecture: ${os.arch()}\r\n`);

    break;
  }

  default: {
    process.stdout.write('Unknown argument.\r\n');
  }
}
