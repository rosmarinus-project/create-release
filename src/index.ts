import * as path from 'path';
import core from '@actions/core';
import { getOctokit, context } from '@actions/github';
import semver from 'semver';
import * as fse from 'fs-extra';

interface PkgInfo {
  version: string;
  name: string;
  path: string;
}

async function getAllPkgJsonInfo(root: string, relativePath?: string): Promise<PkgInfo[]> {
  const allFiles = await fse.readdir(path.join(root, relativePath || ''));

  const pkgJsonFilePath = allFiles.find((file) => file === 'package.json');
  const result: PkgInfo[] = [];

  if (pkgJsonFilePath) {
    const pkgJsonFileContent = await fse.readJSON(path.join(root, relativePath || '', pkgJsonFilePath));

    result.push({
      version: pkgJsonFileContent.version,
      name: pkgJsonFileContent.name,
      path: relativePath || '',
    });
  }

  const dirs = allFiles.filter((file) => fse.statSync(path.join(root, relativePath || '', file)).isDirectory());

  await Promise.all(
    dirs.map(async (dir) => {
      const subPkgJsonInfo = await getAllPkgJsonInfo(root, path.join(relativePath || '', dir));

      result.push(...subPkgJsonInfo);
    }),
  );

  return result;
}

async function run() {
  try {
    const github = getOctokit(process.env.GITHUB_TOKEN || '');

    const { owner, repo } = context.repo;

    const tagName = core.getInput('tag_name', { required: false }) || context.ref || '';

    // This removes the 'refs/tags' portion of the string, i.e. from 'refs/tags/v1.10.15' to 'v1.10.15'
    const tag = tagName.replace('refs/tags/', '');
    const version = semver.valid(tag) ? tag : tag.split('@').pop() || '';

    core.info(`Creating release for tag: ${tag}, version: ${version}`);

    if (!tag || !version) {
      core.warning('No tag found, skipping release creation');

      return;
    }

    const pkgInfoList = await getAllPkgJsonInfo(process.cwd());

    const pkgName = (() => {
      // if the repo only has one package.json
      if (version === tag && pkgInfoList.length === 1 && !pkgInfoList[0].path) {
        return pkgInfoList[0].name;
      }

      const segList = tag.split('@');

      if (semver.valid(segList[segList.length - 1])) {
        return segList.slice(0, -1).join('@');
      }

      return '';
    })();

    const body = (() => {
      const rawBody = core.getInput('body', { required: false }) || '';

      return rawBody
        .replace('%PROJECT_NAME%', pkgName)
        .replace('%PROJECT_PATH%', pkgInfoList.find((info) => info.name === pkgName)?.path || '');
    })();
    const draft = core.getInput('draft', { required: false }) === 'true';
    const prerelease = semver.prerelease(tag) !== null;
    const releaseName = core.getInput('release_name', { required: false }) || tag;

    await github.rest.repos.createRelease({
      owner,
      repo,
      tag_name: tag,
      name: releaseName,
      body,
      draft,
      prerelease,
    });
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
