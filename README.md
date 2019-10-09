# deploy builds

This action deploys your files to a github repo.

# Usage

See [action.yml](action.yml)

Basic:

```yaml
steps:
  - uses: blackthornio/deploy-builds-action@luo/implement-it
    env:
      GITHUB_DEPLOYMENT_TOKEN: ${{ secrets.GITHUB_DEPLOYMENT_TOKEN }}
    with:
      files: |
        lib
        package.json
        README.md
      owner: blackthornio
      repo: the-repo-you-want-to-deploy-to
```

`GITHUB_DEPLOYMENT_TOKEN` must have write access to the repo.
