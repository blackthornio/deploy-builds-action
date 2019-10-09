import * as core from '@actions/core';
import * as util from './util';
import * as tasks from './tasks';

const run = async () => {
  try {
    const filesStr = core.getInput('files', { required: true });
    const files = filesStr.split('\n').map(f => f.trim()).filter(f => !!f);
    if (files.length === 0) {
      throw new Error('nothing to deploy');
    }

    const owner = core.getInput('owner', { required: true });
    const repo = core.getInput('repo', { required: true });

    const accessToken = process.env.GITHUB_DEPLOYMENT_TOKEN;
    if (!accessToken) {
      throw new Error('GITHUB_DEPLOYMENT_TOKEN environment variable is not set properly')
    }

    console.log('files:', JSON.stringify(files, null, 2));
    console.log('repo:', `${owner}/${repo}`);

    const tempDir = '__temp__';
    await util.cmd('mkdir ', [`-p ${tempDir}`]);
    await tasks.publishToRepo(files, tempDir, { accessToken, owner, repo });
  } catch (err) {
    console.error(err);
    core.setFailed(err.message);
  }
}

run();
