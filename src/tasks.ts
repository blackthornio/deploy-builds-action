import * as path from 'path';
import * as util from './util';

/**
 * Deploy build artifacts to repos
 */
export async function publishToRepo(files: string[], tempDir: string, github: {
  accessToken: string;
  owner: string;
  repo: string;
}) {
  const currentDir = process.cwd();

  const REPO_URL = `https://${github.accessToken}@github.com/${github.owner}/${github.repo}.git`;
  const REPO_DIR = path.join(tempDir, `deployment`);
  const COMMITTER_USER_NAME = await util.git([
    '--no-pager show -s --format=\'%cN\' HEAD',
  ]);
  const COMMITTER_USER_EMAIL = await util.git([
    '--no-pager show -s --format=\'%cE\' HEAD',
  ]);

  await util.cmd('rm -rf', [`${REPO_DIR}`]);
  await util.cmd('mkdir ', [`-p ${REPO_DIR}`]);
  process.chdir(REPO_DIR);
  await util.git(['init']);
  await util.git([`remote add origin ${REPO_URL}`]);
  await util.git(['fetch origin master --depth=1']);
  await util.git(['checkout origin/master']);
  await util.git(['checkout -b master']);
  process.chdir('../..');
  await util.cmd('rm -rf', [`${REPO_DIR}/*`]);
  await util.git([`log --format="%h %s" -n 1 > ${REPO_DIR}/commit_message`]);

  for (const file of files) {
    await util.cmd('cp -r', [file, REPO_DIR]);
  }

  process.chdir(REPO_DIR);
  await util.git([`config user.name "${COMMITTER_USER_NAME}"`]);
  await util.git([`config user.email "${COMMITTER_USER_EMAIL}"`]);
  await util.git(['add --all']);
  try {
    await util.git(['commit -F commit_message']);
  } catch (err) {
    if (err.output && err.output.indexOf('nothing to commit')) {
      throw new Error('Nothing has changed, abort');
    } else {
      throw err;
    }
  }

  await util.git(['push origin master --force']);
  process.chdir(currentDir);
}
