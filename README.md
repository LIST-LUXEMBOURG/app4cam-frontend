# App4Cam frontend

App4Cam is the software used on non-lethal camera traps to configure the trap and to download the shots taken.
Its development started within the scope of the PolliCAM project for the traps Aurinion and DiMon.
It is a web application consisting of both backend and frontend parts.

## Specificities

### Technology stack

- [Quasar](https://quasar.dev/)
- [TypeScript](https://www.typescriptlang.org/)
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

#### Development commands

- Run unit tests: `npm run test:unit`
- Rerun unit tests automatically on file changes: `npm run test:unit:watch` or `npm run test:unit:watchAll`
- Lint files: `npm run lint`
- Format files: `npm run format`

### Production setup

#### 1. Prepare the device

1. Install Apache web server: `sudo apt install apache2 -y`
2. Enable rewrite module: `sudo a2enmod rewrite`
3. Enable use of `.htaccess` file by setting `AllowOverride All` in the block for the directory `/var/www/` in the configuration file, usually located under `/etc/apache2/apache2.conf`.
4. Restart Apache: `sudo systemctl restart apache2`
5. If you have not already during backend setup, create a new user, `app4cam` e.g., with a password you remember: `sudo adduser <user>`
6. Transfer Apache folder ownership to your user: `sudo chown -R <user> /var/www/html`

#### 2. Build the application

You can build the application on a computer and copy the build to the device, or you build the application directly on the device:

1. Clone this repository: `git clone --single-branch --branch main https://git.list.lu/host/mechatronics/app4cam-frontend.git`
2. Change into the directory: `cd app4cam-frontend`
3. Install dependencies: `npm ci`
4. Copy an existing config file to `.env`.

- `.env.pollicam`: for the traps Aurinion and DiMon within the scope of the PolliCAM project
- `.env.sample`: example for the case you run the backend on the same device
- `.env.testing_raspberry_pi`: for continuous deployment (CD) on Raspberry Pi
- `.env.testing_variscite_mx6`: for continuous deployment (CD) on Variscite MX6
- `.env.testing_variscite_mx8m`: for continuous deployment (CD) on Variscite MX8M

5. Edit the config file if needed.
6. Build app for production: `quasar build` or `npm run build`
7. Delete old files Apache is serving: `sudo rm -r /var/www/html/*`
8. Copy the build to Apache's serving folder: `sudo cp -r dist/. /var/www/html/`

#### 3. For continuous deployment (CD) only

If you have set up the backend already, you just need to do step 4.

1. Log in as user: `su - <user>`
2. Generate a public/private key pair without passphrase: `ssh-keygen -t ed25519`
3. Copy public key to `.ssh/authorized_keys` file.
4. Define the following variables in Gitlab:

- `RASPBERRY_PI_HOST`: IP address of Raspberry Pi
- `RASPBERRY_PI_PRIVATE_KEY`: private key of Raspberry Pi user
- `RASPBERRY_PI_USER`: user of Raspberry Pi
- `VARISCITE_MX6_HOST`: IP address of Variscite MX6
- `VARISCITE_MX6_PRIVATE_KEY`: private key of Variscite MX6 user
- `VARISCITE_MX8M_HOST`: IP address of Variscite MX8M
- `VARISCITE_MX8M_PRIVATE_KEY`: private key of Variscite MX8M user
- `VARISCITE_USER`: user of Variscite devices

5. Delete private key file: `rm .ssh/id_ed25519`
6. Remove all "group" and "other" permissions for the `.ssh` directory: `chmod -R go= ~/.ssh`
7. Logout: `exit`
8. Open SSH config file: `sudo nano /etc/ssh/sshd_config`
9. Disable password authentication by setting `PasswordAuthentication no`.
10. Prepend the following line: `Match User <user>`
11. Append the following line: `Match all`
12. Restart `sshd` service: `sudo systemctl restart ssh`
13. Install rsync: `sudo apt install rsync -y`
