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

For continuous deployment (CD) and for production, a service needs to be created on the remote server:

1. Create the `app4cam-frontend` service by creating the file `/etc/systemd/system/app4cam-frontend.service` with the following content:

```
[Unit]
Description=Service that keeps running app4cam-frontend from startup
After=network.target

[Install]
WantedBy=multi-user.target

[Service]
Type=simple
ExecStart=npx vite preview --host
WorkingDirectory=/home/pi/app4cam-frontend
Restart=always
RestartSec=5
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=%n
```

2. Run: `sudo systemctl daemon-reload`
3. Run: `sudo systemctl enable app4cam-frontend`

For CD only: Make sure to have run the following command once (maybe already done during backend setup): `ssh-keyscan -t ed25519 git.list.lu >> ~/.ssh/known_hosts`

Finally, run the commands sent via SSH to the server found in the `.gitlab-ci.yml` file.
You may need to adapt the options in the .env file used.

## Development commands

- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Locally preview production build: `npm run preview`
- Run unit tests: `npm run test`
- Rerun unit tests automatically on file changes: `npm run test:watch`
- Lint files: `npm run lint`
