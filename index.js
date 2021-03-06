import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/** @param {string} cwd */
export async function create(cwd) {
	mkdirp(cwd);

	const projectName = toValidProjectName(path.basename(path.resolve(cwd)));
	const templateDir = fileURLToPath(new URL(`./template`, import.meta.url).href);

	copy(templateDir, cwd, (fileName) => fileName.replace('DOT-', '.'));

	['package.json', 'README.md'].forEach((fileName) => {
		const filePath = path.join(cwd, fileName);
		const fileContents = fs.readFileSync(filePath, 'utf-8');

		fs.writeFileSync(filePath, fileContents.replace(/~PROJECT_NAME~/g, projectName));
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
