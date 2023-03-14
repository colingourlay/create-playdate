# create-playdate

Generate a Playdate Lua SDK project, which you can then manage with **npm**, **yarn** or **pnpm**

## Quick Start

There's nothing to pre-install (except [Node.js](https://nodejs.org/en/)). Run this command in your terminal and answer the handful of prompts:

```sh
npm create playdate@latest
```

## Alternative usage methods

### Global installation

If you want to pre-install the generator, you can run:

```sh
npm install --global create-playdate
```

Then, run this command to generate a project:

```sh
create-playdate
```

I wouldn't recommend this though, as it'll be up to you to update the generator manually, whereas `npm create playdate@latest` (or `yarn create playdate` / `pnpm create playdate`) will always ensure you run latest version.

### API ▸ `create` function

The project generator can be called from within your own Node.js codebase. First, add the package dependency:

```sh
npm install create-playdate
```

Then, import the `create` function into your code, and call it with an object containing the `cwd` you want to generate a project in and a `name` for the game. Optionally, you can also include the name of the `author` and zero or more `editors`.

```js
import { create } from 'create-playdate';

create({
	cwd: '/Users/someone-cool/playdate-games/my-game',
	name: 'My Game',
	author: 'Someone Cool',
	editors: ['vscode'] // (and/or 'nova')
});
```

## Attributions

- Template structure & `main.lua` contents suggested by [Panic](https://sdk.play.date/1.9.0/Inside%20Playdate.html#_a_basic_playdate_game_in_lua)
- Project inspired by [potch](https://twitter.com/potch)'s Playdate `package.json`
