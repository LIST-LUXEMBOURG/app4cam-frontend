# App4Cam frontend

App4Cam is the software used on non-lethal camera traps to configure the trap and to download the shots taken.
Its development started within the scope of the PolliCAM project for the traps Aurinion and DiMon.
It is a web application consisting of both backend and frontend parts.

## Specificities

### Technology stack

- [Quasar](https://quasar.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Vue.js](https://vuejs.org/)

### Single File Components

Vue 3 `<script setup>` Single File Components (SFCs) are used; Check out the [script setup docs](https://vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Setup

### Prerequisites

- Git
- \>= Node.js 16.x

### Development setup

1. Install dependencies: `npm install`
2. Copy the config file `.env.sample` to `.env`.
3. Edit the latter config file as needed.
4. Start app in development mode: `quasar dev` or `npm run dev`

#### Recommended plugins for Visual Studio Code

- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

#### Type support for `.vue` imports in TypeScript with Volar

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.

### Production setup

1. Install Apache web server: `sudo apt install apache2 -y`
2. Transfer ownership to your user: `sudo chown -R pi /var/www/html`
3. For continuous deployment (CD) only: Make sure to have run the following command once (maybe already done during backend setup): `ssh-keyscan -t ed25519 git.list.lu >> ~/.ssh/known_hosts`
4. Clone this repository: `git clone --single-branch --branch main https://git.list.lu/host/mechatronics/app4cam-frontend.git`
5. Change into the directory: `cd app4cam-frontend`
6. Install dependencies: `npm ci`
7. Copy the config file `.env.app4cam` to `.env`.
8. Edit the latter config file as needed.
9. Build app for production: `quasar build` or `npm run build`
10. Delete old files Apache is serving: `sudo rm -r /var/www/html/*`
11. Copy the build to Apache's serving folder: `sudo cp -r dist/. /var/www/html/`

## Development commands

- Run unit tests: `npm run test:unit`
- Rerun unit tests automatically on file changes: `npm run test:unit:watch` or `npm run test:unit:watchAll`
- Lint files: `npm run lint`
- Format files: `npm run format`
