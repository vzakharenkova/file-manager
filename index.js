import { exit } from 'process';
import {
  blue,
  getDirname,
  yellow,
  red,
  getCurrentLocationMsg,
} from './shared/utils.js';

const initFileManager = async () => {
  const { createInterface } = await import('readline');
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  if (process.argv.length === 2) {
    console.log(red('Please, pass username.'));
    process.exit(1);
  }

  if (!process.argv[2].startsWith('--username=')) {
    console.log(red('Invalid input!'));
    exit(1);
  }

  const { homedir } = await import('os');
  process.chdir(homedir());

  const username = process.argv[2].slice('--username='.length);

  const __dirname = getDirname(import.meta.url);

  console.log(blue(`Welcome to the File Manager, ${username}!`));

  const { commandHandler } = await import('./handlers/commandHandler.js');

  const askForCommand = () => {
    rl.question(
      yellow(
        `\r\n${getCurrentLocationMsg()}Enter a command.\r\nTo get the list of available commands enter "cl".\r\n\r\n`
      ),
      (input) => commandHandler(rl, input, __dirname, askForCommand)
    );
  };

  askForCommand();

  rl.on('SIGINT', () => {
    console.log(
      blue(`Thank you for using File Manager, ${username}, goodbye!`)
    );

    process.exit();
  });
};

await initFileManager();
