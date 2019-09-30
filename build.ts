import { promises as fs } from 'fs';

async function run() {
  const path = `${__dirname}/adapters`;
  const dir = await fs.readdir(path);
  await fs.mkdir('public');
  return await fs.writeFile('public/index.json', JSON.stringify(dir));
}

run();
