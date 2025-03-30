# uabc-web
The repository for WDCC Projects' 2025 UABC project :)

## Setting up the project

### Prerequisites

#### Node.js installation
The first thing you must do is install `Node.js` so you can access the `pnpm` package manager.

**Volta (Recommended)**

It is recommended to use [`Volta`](https://volta.sh/) to manage the Node.js version. 

Follow the [instructions](https://docs.volta.sh/guide/getting-started) on the website to install it.

**nvm (Node Version Manager)**
However if you are having problems or do not want to use `Volta` it is also advisable to use `nvm` to manage the Node.js version.

- [Windows installation](https://github.com/coreybutler/nvm-windows/releases)
- [UNIX](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) 

In the same directory as this `README.md` file, run the following command to install the correct version of Node.js:

```bash
nvm install
nvm use
```

#### Using pnpm
If you complete one of the above steps you can install the project dependencies by running:

```bash
corepack enable
pnpm install
```

Once `pnpm install` has finished, you can start the development server by running:

```bash
pnpm dev
```

## acknowledgements

shoutout to the team responsible for the prior iteration, at [UABC Portal](https://github.com/UoaWDCC/uabc-portal).
