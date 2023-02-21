# create-playdate

Generate a Playdate Lua SDK project, which you can then manage with **npm** or **yarn**

## Quick Start

Nothing to install (if you already have [Node.js](https://nodejs.org/en/)). Run either of these commands in your terminal and answer the handful of prompts:

```sh
# create a new project in the current directory
npm create playdate@latest

# create a new project in my-game
npm create playdate@latest my-game
```

## Alternative usage methods

### Global installation

If you want to pre-install the generator, you can run:

```sh
npm install --global create-playdate
```

Then, use one of these commands to generate projects:

```sh
# create a new project in the current directory
create-playdate

# create a new project in my-game
create-playdate my-game
```

I wouldn't recommend this though, as it'll be up to you to update the generator manually, whereas `npm create playdate@latest` will always ensure you run latest version.

### API ▸ `create` function

The project generator can be called from within your own Node.js codebase. First, add the package dependency:

```sh
npm install create-playdate
```

Then, import the `create` function into your code, and call it with the `path` you want to generate a project in, a `name` for the game and (optionally) the name of the `author`:

```js
import { create } from "create-playdate";

create(
  "/Users/someone-cool/playdate-games/my-game",
  "My Game,
  "Someone Cool"
);
```

## Attributions

- Template structure & `main.lua` contents suggested by [Panic](https://sdk.play.date/1.9.0/Inside%20Playdate.html#_a_basic_playdate_game_in_lua)
- Project inspired by [potch](https://twitter.com/potch)'s Playdate `package.json`
