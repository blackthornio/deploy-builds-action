import * as core from '@actions/core';
import * as github from '@actions/github';
import * as io from '@actions/io';
import * as exec from '@actions/exec';

const run = async () => {
  try {
    const filesStr = core.getInput('files', { required: true });
    const files = filesStr.split('\n').map(f => f.trim()).filter(f => !!f);
    if (files.length === 0) {
      throw new Error('nothing to deploy');
    }
    const deploymentDir = 'github-deployment';
    io.mkdirP(deploymentDir);
    const options = { recursive: true, force: false }
    files.forEach(f => {
      io.cp(f, deploymentDir, options);
    });
    console.log('files', JSON.stringify(files, null, 2));
    await exec.exec('git status');
    const token = process.env.GITHUB_DEPLOYMENT_TOKEN;
    console.log('TOKEN', token);
    const octokit = new github.GitHub(token!);
    const issues = await octokit.issues.listForRepo({ owner: 'blackthornio', repo: 'schema-migrate-builds' });
    console.log(JSON.stringify(issues, null, 2));
    throw new Error('force fail');
  } catch (err) {
    core.setFailed(err.message);
  }
}

run();
