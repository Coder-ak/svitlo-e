# SVITLO-E

SVITLO-E is an open-source project that aims to create a platform for tracking power outages in your area.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (>=16)
- npm

### Installation

1. Clone the repository

```console
git clone https://github.com/Coder-ak/svitlo-e.git
```
2. Create `.env` file with following content

```
TOKEN_SECRET=<generate secret to sign JWT tokens>
DB_PATH=<path to nedb database>
PORT=<nodejs server port>
```
3. Start the development server

```console
npm run serve
```

The nodejs server should now be running on `http://localhost:3000`
The client should now be running on `http://localhost:8080'

4. Build

```console
npm run build
```

Compiled files should be at `/dist` folder.

## Built With

- [TypeScript](https://www.typescriptlang.org)
- [Esbuild](https://esbuild.github.io)
- [Express](https://github.com/expressjs/expressjs.com)

## Contributing

We welcome contributions to the project. Please submit a pull request with a clear description of your changes.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
