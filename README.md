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
- \>= Node.js 14.x

### Development setup

1. Install dependencies: `npm install`
2. Copy the config file `.env.sample` to `.env.development.local`.
3. Edit the latter config file as needed.

#### Recommended plugins for Visual Studio Code

- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

#### Type support for `.vue` imports in TypeScript with Volar

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.

### Production setup

1. Install Apache web server: `sudo apt install apache2 -y`
2. For continuous deployment (CD) only: Make sure to have run the following command once (maybe already done during backend setup): `ssh-keyscan -t ed25519 git.list.lu >> ~/.ssh/known_hosts`
3. Clone this repository: `git clone --single-branch --branch main https://git.list.lu/host/mechatronics/app4cam-frontend.git`
4. Change into the directory: `cd app4cam-frontend`
5. Install dependencies: `npm ci`
6. You may want to adapt the options in the `.env.app4cam` file used.
7. Build: `npx vite build --mode app4cam`
8. Delete old files Apache is serving: `sudo rm -r /var/www/html/*`
9. Copy the build to Apache's serving folder: `sudo cp -r ~/app4cam-frontend/dist/. /var/www/html/`

## Development commands

- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Locally preview production build: `npm run preview`
- Run unit tests: `npm run test`
- Rerun unit tests automatically on file changes: `npm run test:watch`
- Lint files: `npm run lint`
