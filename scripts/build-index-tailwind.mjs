import fs from 'node:fs/promises';
import path from 'node:path';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

const root = process.cwd();
const inputPath = path.join(root, 'public', 'index-tailwind.source.css');
const outputPath = path.join(root, 'public', 'index-tailwind.css');

const input = await fs.readFile(inputPath, 'utf8');
const result = await postcss([tailwindcss()]).process(input, {
  from: inputPath,
  to: outputPath,
});

await fs.writeFile(outputPath, result.css);
