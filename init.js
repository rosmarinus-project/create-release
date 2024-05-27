import { execSync } from 'child_process';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = __dirname;

const projectName = process.argv[2];

if (!projectName) {
  throw new Error('Missing project name');
}

execSync('pnpm i', { cwd: projectRoot, stdio: 'inherit' });

const KEY = 'template-name';

const FILES = ['.github/workflows/publish.yml', 'package.json', 'README.md'];

function main() {
  for (const file of FILES) {
    const content = readFileSync(file, 'utf-8');
    const newContent = content.replace(new RegExp(KEY, 'g'), projectName);

    writeFileSync(file, newContent);
  }

  unlinkSync(__filename);
}

main();
