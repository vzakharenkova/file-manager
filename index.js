import { getDirname } from './shared/utils.js';

const initFileManager = async () => {
  const { createInterface } = await import('readline');
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const { initErrorMsg } = await import('./shared/messages.js');

  if (process.argv.length === 2) {
    rl.write(initErrorMsg);
    process.exit(1);
  }

  const { invalidCommandErrorMsg, commandArgs } = await import(
    './shared/messages.js'
  );

  if (!process.argv[2].startsWith(commandArgs.username)) {
    throw new Error(invalidCommandErrorMsg);
  }

  const { homedir } = await import('os');
  process.chdir(homedir());

  const username = process.argv[2].slice(commandArgs.username.length);
  const { getWelcomeMsg, getExitMsg } = await import('./shared/messages.js');

  const __dirname = getDirname(import.meta.url);

  rl.write(getWelcomeMsg(username));
  const { commandHandler } = await import('./handlers/commandHandler.js');

  const askForCommand = () => {
    rl.question(
      '\r\nEnter a command.\r\nTo get the list of available commands enter "gcl".\r\n\r\n',
      (input) => commandHandler(rl, input, __dirname, askForCommand)
    );
  };

  askForCommand();

  rl.on('SIGINT', () => {
    rl.write(getExitMsg(username));

    process.exit();
  });
};

await initFileManager();
