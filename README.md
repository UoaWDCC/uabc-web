# UOA Badminton Club Website 🏸
Project initiated by WDCC in 2023.

## About ⚡

**2025:** We are focused on creating a functional website for the University of Auckland Badminton Club. The functional website will comprise a membership process (sign-up, sign-in, sign-out), membership management system, court booking process and more. The website will be built to be user-friendly and aesthetic, alongside having an effective and efficient back-end to satisfy the clients.

## Setting up the project 💻

### Prerequisites

#### Node.js installation

You will first need to install `Node.js` in order to access the `pnpm` package manager.

**Volta (Recommended)**

It is recommended to use [`Volta`](https://volta.sh/) to manage the Node.js version.

Follow the [instructions](https://docs.volta.sh/guide/getting-started) on the website to install it.

**nvm (Node Version Manager)**

However, if you are having problems, or do not want to use `Volta`, a recommended alternative is to use `nvm` to manage the Node.js
version.

- [Windows installation](https://github.com/coreybutler/nvm-windows/releases)
- [UNIX](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)

In the root directory, run the following commands to install the correct version of Node.js:

```bash
nvm install
nvm use
```

### Running the project

#### Using pnpm

If you complete one of the above steps, you can then install the project dependencies by running:

```bash
corepack enable
pnpm install
```

Once `pnpm install` has finished, you can start the development server by running:

```bash
pnpm dev
```

The development server will be running at `http://localhost:3000`.

### Keeping a clean codebase

We rely on [Biome](http://biomejs.dev/) to keep the codebase clean and consistent with linting and formatting. [husky](https://typicode.github.io/husky/) and [lint-staged](https://www.npmjs.com/package/lint-staged) has been installed to setup pre-commit hooks that will automatically format your files when committing. CI tests will run Biome checks to ensure your code has been formatted properly and follows linting rules.

#### IDE Setup

If you are using `VSCode`, extensions will be recommended to you (namely Biome's VSC plugin). You can [open the extensions panel](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace), find the recommended ones and install them. VSC files have already been setup as part of the project to assist with Biome formatting.

Otherwise, you are responsible for figuring out how to configure those plugins in your IDE. (Most IDEs
like [WebStorm](https://www.jetbrains.com/webstorm/) and [Zed](https://zed.dev/) have plugins for these tools built in).

#### Documentation

We recommend usage of the [`JSDoc`](https://jsdoc.app/) syntax to document code. This will help other developers understand the function of code more easily, as names can be misleading. 

For example:
```ts
/**
 * Adds two numbers together
 * @param {number} a - The first number
 * @param {number} b - The second number
 * @returns {number} The sum of the two numbers
 */
export const add = (a: number, b: number) => a + b
```

### Environment Variables

Environment variables are used to store sensitive information that should not be stored in the codebase. These are stored in a `.env` file in the root of the project.

Copy the `.env.example` file and rename it to `.env`, then edit the values according to the keys.

### Type Generation

We use Payload's built in code generation to generate types for our project. To do this, you can run the following command:

```bash
pnpm generate:types
```

### Theme Token Generation

We use Yamada CLI to generate theme tokens for our project. This helps maintain consistent styling across the application. To generate theme tokens, run:

```bash
pnpm theme
```

This command will process the theme tokens defined in `./src/theme` and generate the necessary theme files.

### Automated Testing

Automated testing is an important part of writing code that can be maintained and understood long after developers
stop working on code.

We use [`vitest`](https://vitest.dev/guide/why.html) as our test runner because of its ease of setup.

Tests should be prefixed with the extension `*.test.ts|x`. For example, `adder.ts` would have a test file called
`adder.test.ts`.

To run all tests, the following command can be used:

```bash
pnpm test
```

To run a single test, you can use the following command:

```bash
# src/app/example-double-admin-count/route.ts can be any file path that points to a test.
# Or you can replace the file path with a pattern (like a file name)
pnpm test src/app/example-double-admin-count/route.test.ts
```

## Tech Stack ⚙

The project is _mainly_ built around the following technologies:

- [Next.js](https://nextjs.org/)
    - The main framework for this project, it is most important to understand that we are using
      the [App Router](https://nextjs.org/docs/app)
      and [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) to build the
      project. Note that you will need to have some understanding of [React](https://react.dev/learn) to work on this
      project.
- [PayloadCMS](https://payloadcms.com/)
    - We are using PayloadCMS to manage the content of the website, as well as define the shape of our data. This takes
      away a lot of the hard work that is put into setting up a database and API. You will have to familiarise yourself
      with how to use Payload's [local API](https://payloadcms.com/docs/local-api/overview).

Additional information is to be documented on the [wiki](https://github.com/UoaWDCC/uabc-web/wiki) for some of the
smaller dependencies

## Contributing 📝

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information on how to make changes to this project.

## Acknowledgements ⭐

### 2025 Team 😎

| Name     |   Role   |
|----------|----------|
| Eddie Wang    | Project Manager  |
| Jeffery Ji   | Tech Lead     |
| Seungbeom Yang   | Developer/Designer   |
| Benjamin Kee   | Developer     |
| Brandon Chan   | Developer     |
| Derrick Trang   | Developer     |
| Mikai Somerville   | Developer     |
| Shintaro Jokagi   | Developer     |
| Ann Lowe   | Designer     |
| Yvonne Lo   | Designer     |

Shoutout to the team responsible for the prior iteration 👍 At [UABC Portal](https://github.com/UoaWDCC/uabc-portal).
