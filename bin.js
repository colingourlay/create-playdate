#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { bold, cyan, gray, green, red } from 'kleur/colors';
import prompts from 'prompts';
import { create } from './index.js';

// prettier-ignore
const disclaimer = `
${bold(cyan('Welcome to the Playdate project generator!'))}

Problems? Open an issue on ${cyan('https://github.com/colingourlay/create-playdate/issues')} if none exists already.
`;

const { version } = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf-8'));

async function main() {
	console.log(gray(`\ncreate-playdate version ${version}`));
	console.log(disclaimer);

	let cwd = process.argv[2] || '.';

	if (cwd === '.') {
		const opts = await prompts([
			{
				type: 'text',
				name: 'dir',
				message: 'Where should we create your project?\n  (leave blank to use current directory)'
			}
		]);

		if (opts.dir) {
			cwd = opts.dir;
		}
	}

	if (fs.existsSync(cwd)) {
		if (fs.readdirSync(cwd).length > 0) {
			const response = await prompts({
				type: 'confirm',
				name: 'value',
				message: 'Directory not empty. Continue?',
				initial: false
			});

			if (!response.value) {
				process.exit(1);
			}
		}
	}

	await create(cwd);

	console.log(bold(green('\nYour project is ready!')));
	console.log('\nNext steps:');

	let i = 1;
	const relative = path.relative(process.cwd(), cwd);

	if (relative !== '') {
		console.log(`  ${i++}: ${bold(cyan(`cd ${relative}`))}`);
	}

	console.log(`  ${i++}: ${bold(cyan('npm install'))} (or pnpm install, etc)`);
	// prettier-ignore
	console.log(`  ${i++}: ${bold(cyan('git init && git add -A && git commit -m "Initial commit"'))} (optional)`);
	console.log(`  ${i++}: ${bold(cyan('npm start'))}`);

	console.log(`\nTo stop the watcher, hit ${bold(cyan('Ctrl-C'))}`);
}

main();
