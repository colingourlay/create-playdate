#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { bold, cyan, gray, red, yellow } from 'kleur/colors';
import prompts from 'prompts';
import { create } from './index.js';

const MSG_DISCLAIMER = `
${bold(yellow('Welcome to the Playdate project generator!'))}

Problems? Open an issue: ${yellow('https://github.com/colingourlay/create-playdate/issues')}
`;

const MSG_SDK_PATH = `
${red(`Warning: The Playdate SDK was not found in your ${cyan('PATH')} environment variable.`)}

Before starting work on your project, remember to download & install the SDK
from ${yellow('https://play.date/dev/')}${
	process.platform === 'win32' ? ` and update your ${cyan('PATH')}` : ''
}`;

const { version } = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf-8'));

async function main() {
	console.log(gray(`\ncreate-playdate version ${version}`));
	console.log(MSG_DISCLAIMER);

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

	console.log(bold(yellow('\nYour project is ready!')));

	console.log('\nNext steps:\n');

	let i = 1;
	const relative = path.relative(process.cwd(), cwd);

	if (relative !== '') {
		console.log(`  ${i++}: ${bold(cyan(`cd ${relative}`))}`);
	}

	console.log(`  ${i++}: ${bold(cyan('npm install'))}`);
	console.log(`  ${i++}: ${bold(cyan('npm start'))}`);

	if (!/PlaydateSDK.bin/.test(process.env.PATH)) {
		console.log(MSG_SDK_PATH);
	}

	console.log(bold(yellow('\nHappy hacking!')));
}

main();
