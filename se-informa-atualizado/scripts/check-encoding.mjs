import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const decoder = new TextDecoder('utf-8', { fatal: true });
const files = ['index.html', 'package.json', '_headers', '.editorconfig', '.gitattributes', '.gitignore'];
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collect(path);
    else if (/\.(?:[cm]?js|[cm]?ts|json|html|css|sql)$/.test(entry.name)) files.push(path);
  }
}
await Promise.all(['src', 'netlify/functions', 'netlify/database', 'db', 'lib', 'scripts', 'tests'].map(collect));
for (const path of files) {
  const text = decoder.decode(await readFile(path));
  if (text.includes('\uFFFD') || text.includes('\0')) throw new Error(`Texto corrompido: ${path}`);
}
console.log(`UTF-8 válido: ${files.length} arquivos de texto; sem bytes nulos ou caracteres de substituição.`);
