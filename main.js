// @ts-check
const core = require('@actions/core');
const github = require('@actions/github');

const run = async () => {
  const token = core.getInput('GITHUB_TOKEN');
  const octokit = new github.GitHub(token);
  const issues = await octokit.issues.listForRepo({ owner: 'crysislinux', repo: 'schema-migrate-builds' });
  console.log(JSON.stringify(issues, null, 2));
}

run();
