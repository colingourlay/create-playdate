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

const MSG_ENVIRONMENT_VARIABLES = `
${red(`Warning: The Playdate SDK was not found in your ${cyan('PATH')} environment variable.`)}

Before starting work on your project, remember to:

  1) Download & install the SDK from ${yellow('https://play.date/dev/')}
  2) Set the ${cyan('PLAYDATE_SDK_PATH')} environment variable to your SDK installation path, and
  3) Add the SDK's ${cyan('bin')} directory to your ${cyan('PATH')} environment variable
`;

const USER_AGENT = process.env.npm_config_user_agent;

const [, PACKAGE_MANAGER] = (USER_AGENT || '').match(/^\w+/) || [, 'npm'];

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

	const { author, name, editors } = await prompts([
		{
			type: 'text',
			name: 'name',
			message: `What's your game called?`,
			initial: cwd
				.replace(/^\w/, (match) => match.toUpperCase())
				.replaceAll(/-(\w)/g, (_match, group1) => ` ${group1.toUpperCase()}`)
		},
		{
			type: 'text',
			name: 'author',
			message: `What's your name?`
		},
		{
			type: 'multiselect',
			name: 'editors',
			message: 'Which editors will you be using, if any?',
			choices: [
				{ title: 'Nova', value: 'nova' },
				{ title: 'Visual Studio Code', value: 'vscode' }
			],
			instructions: false,
			hint: '- Space to select. Enter to submit'
		}
	]);

	await create({ cwd, name, author, editors });

	console.log(bold(yellow('\nYour project is ready!')));

	console.log('\nNext steps:\n');

	const relative = path.relative(process.cwd(), cwd);
	let i = 1;

	if (relative !== '') {
		console.log(`  ${i++}) ${bold(cyan(`cd ${relative}`))}`);
	}

	console.log(
		`  ${i++}) ${bold(cyan(`${PACKAGE_MANAGER}${PACKAGE_MANAGER === 'yarn' ? '' : ' install'}`))}`
	);
	console.log(`  ${i++}) ${bold(cyan(`${PACKAGE_MANAGER} start`))}`);

	if (!/PlaydateSDK.bin/.test(process.env.PATH)) {
		console.log(MSG_ENVIRONMENT_VARIABLES);
	}

	console.log(bold(yellow('\nHappy hacking!')));
}

main();
