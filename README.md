# App4Cam Frontend

## Setup

1. Install dependencies: `npm install`
2. Copy the config file `.env.sample` to `.env.development.local`.
3. Edit the latter config file as needed.

For continuous deployment (CD), a service needs to be created on the remote server:

1. Create the `app4cam-frontend` service by creating the following file: `/etc/systemd/system/app4cam-frontend.service`

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

## Development

- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Locally preview production build: `npm run preview`
- Run unit tests: `npm run test`
- Rerun unit tests automatically: `npm run test:watch`
- Lint files: `npm run lint`

## Specificities

### Technology stack

- [TypeScript](https://www.typescriptlang.org/)
- [Vue.js](https://v3.vuejs.org/)
- [Quasar](https://quasar.dev/)

### Single File Components

This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

### Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.

## Recommended plugins for Visual Studio Code

- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)
