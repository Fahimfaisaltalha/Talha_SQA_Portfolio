import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const references = [...html.matchAll(/(?:href|src)="([^"#]+)"/g)]
  .map((match) => match[1])
  .filter((value) => !value.includes(':') && !value.startsWith('//'));
const missing = references.filter((value) => !fs.existsSync(path.join(root, value)));

console.log(`Local references: ${references.length}; missing: ${missing.length}`);
if (missing.length) {
  console.error(missing.join('\n'));
  process.exit(1);
}

const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const openBraces = (css.match(/\{/g) || []).length;
const closeBraces = (css.match(/\}/g) || []).length;
if (openBraces !== closeBraces) {
  console.error(`CSS brace mismatch: ${openBraces} open / ${closeBraces} close`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(path.resolve('.openai/hosting.json'), 'utf8'));
if (!manifest.project_id || manifest.static?.directory !== 'dist') {
  console.error('Hosting manifest is incomplete.');
  process.exit(1);
}

console.log('CSS structure and hosting manifest: valid');
