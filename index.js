import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * @param {Object} options
 * @param {string} options.cwd
 * @param {string} options.name
 * @param {string | undefined} options.author
 */
export async function create({ cwd, name, author }) {
	mkdirp(cwd);

	const projectName = toValidProjectName(path.basename(path.resolve(cwd)));
	const templateDir = fileURLToPath(new URL(`./template`, import.meta.url).href);

	copy(templateDir, cwd, (fileName) => fileName.replace('DOT-', '.'));

	['package.json', 'README.md'].forEach((fileName) => {
		const filePath = path.join(cwd, fileName);
		const fileContents = fs.readFileSync(filePath, 'utf-8');
		const templatedFileContents = fileContents
			.replaceAll(/~PROJECT_NAME~/g, projectName)
			.replaceAll(/~AUTHOR_PROP~/g, author ? `\n\t"author": "${author}",` : '')
			.replaceAll(/~NAME~/g, name)
			.replaceAll(/~BYLINE~/g, author ? ` by ${author}` : '');

		fs.writeFileSync(filePath, templatedFileContents);
	});
}

/** @param {string} dir */
function mkdirp(dir) {
	try {
		fs.mkdirSync(dir, { recursive: true });
	} catch (e) {
		if (e.code === 'EEXIST') return;
		throw e;
	}
}

/**
 * @template T
 * @param {T} x
 */
function identity(x) {
	return x;
}

/**
 * @param {string} from
 * @param {string} to
 * @param {(basename: string) => string} rename
 */
function copy(from, to, rename = identity) {
	if (!fs.existsSync(from)) return;

	const stats = fs.statSync(from);

	if (stats.isDirectory()) {
		fs.readdirSync(from).forEach((file) => {
			copy(path.join(from, file), path.join(to, rename(file)));
		});
	} else {
		mkdirp(path.dirname(to));
		fs.copyFileSync(from, to);
	}
}

/** @param {string} name */
function toValidProjectName(name) {
	return name
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/^[._]/, '')
		.replace(/[^a-z0-9~.-]+/g, '-');
}
