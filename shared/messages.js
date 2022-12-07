export const initErrorMsg = 'Please, pass username!';

export const invalidCommandErrorMsg = 'Invalid input!';

export const dirNotExistMsg = 'This directory is not exist!\r\n';

export const changeDirErrMsg = 'Can not change directory!\r\n';

export const commandArgs = { username: '--username=' };

export const getCurrentLocationMsg = () =>
  `You are currently in ${process.cwd()}\r\n`;

export const getWelcomeMsg = (username) =>
  `Welcome to the File Manager, ${username}!\r\n${getCurrentLocationMsg()}`;

export const getExitMsg = (username) =>
  `Thank you for using File Manager, ${username}, goodbye!`;
