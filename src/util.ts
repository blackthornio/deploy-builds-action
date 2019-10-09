import * as cp from 'child_process';

export type BaseFn = (command: string) => string;

export function exec(
  command: string,
  args: string[],
  base: BaseFn = fromPath
): Promise<string> {
  return new Promise((resolve, reject) => {
    cp.exec(base(command) + ' ' + args.join(' '), (err, stdout) => {
      if (err) {
        const output = stdout.toString().trim();
        return reject({ err, output });
      }

      resolve(stdout.toString());
    });
  });
}

export function cmd(command: string, args: string[]): Promise<string> {
  return exec(command, args, (_command: string) => _command);
}

export function git(args: string[]): Promise<string> {
  return cmd('git', args);
}

export function npm(args: string[]): Promise<string> {
  return cmd('npm', args);
}

export function ignoreErrors<T>(promise: Promise<T>): Promise<T | null> {
  return promise.catch(() => null);
}

export function fromPath(command: string) {
  return command;
}
