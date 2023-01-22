# Iso ![GitHub package.json version](https://img.shields.io/github/package-json/v/ogarich89/iso?style=flat-square) 
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/ogarich89/iso/react?style=for-the-badge) ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/ogarich89/iso/fastify?style=for-the-badge) ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/ogarich89/iso/typescript?style=for-the-badge)

Iso is starter-pack for creating isomorphic single-page application with using SSR technology on NodeJS.

Powered by [ogarich89](https://github.com/ogarich89)

> #### Warning
> For a comfortable development you will need the knowledge of React, Recoil and Fastify.

### Tech

ISO uses a number of open source projects to work properly:

* [Node.js](https://nodejs.org/) - Open-source, cross-platform JavaScript runtime environment.
* [Typescript](https://www.typescriptlang.org/) - JavaScript with syntax for types.
* [Fastify](https://www.fastify.io/) - Fast and low overhead web framework, for Node.js
* [React](https://reactjs.org/) - JavaScript library for building user interfaces
* [Recoil](https://recoiljs.org/) - State management library for React
* [Webpack](https://webpack.js.org/) - Module bundler
* [HMR](https://webpack.js.org/concepts/hot-module-replacement/) - Hot Module Replacement
* [Browsersync](https://browsersync.io/) - Time-saving synchronised browser testing
* [SWC](https://swc.rs/) - Rust-based platform for the Web
* [ESLint](https://eslint.org/) - Statically analyzes your code to quickly find problems.
* [Loadable-components](https://www.smooth-code.com/open-source/loadable-components/) - React code splitting library.
* [Prisma](https://www.prisma.io/) - Next-generation Node.js and TypeScript ORM
* [react-i18next](https://react.i18next.com/) - Powerful internationalization framework for React / React Native which is based on i18next.
* Etc. (See package.json)

And of course ISO itself is open source with a [public repository]
 on GitHub.

# Usage

### Install

ISO requires [Node.js](https://nodejs.org/) v16+ and [Redis](https://redis.io) (optional) to run.


```sh
$ git clone https://github.com/ogarich89/iso.git <project name>
$ cd <project name>
$ yarn install
```

### Development

- Create configuration file
```sh
$ touch config/environment/development.json
```
- Set params 
```json
{
 "port": 3000,
 "browserSyncPort": 3001,
 "api": "https://reqres.in",
 "withStatic": true,
 "inspect": true,
 "logger": true
}
```

`port` - Node.js server port \
`browserSyncPort` - Development proxy server port with browserSync and HMR \
`api` - Backend API hostname \
`sessionRedisDb` - Redis database index \
`production` - Webpack production mode \
`withStatic` - Serve static files with NodeJS server \
`withRedis` - Session with Redis store \
`inspect` - Debugging Node.js with Chrome DevTools \
`logger` - Fastify logger \
`sentryDSN` - Error monitoring with [Sentry](https://sentry.io) \
`certificate` - Optional object for run https server `{ "key": "/path/to/key.pem", "cert": "/path/to/cert.pem" }`

_If you want to use [Prisma](https://www.prisma.io/) run the command_

```sh
$ cp .env.example .env
```
_and set `DATABASE_URL` environment variable_

```dotenv
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/iso?connect_timeout=1000
```


- Run each command in a separate terminal tab
```sh
$ yarn client
$ yarn server
$ yarn nodemon
```
or
```sh
$ yarn dev
```

Open in browser http://localhost:3001

---

_Run without watch files, HMR, BrowserSync, Gulp_
```sh
$ yarn start
```

_Open in browser_ http://localhost:3000

---



#### Building for source
For production release:
```sh
$ yarn production
```
Depending on NODE_ENV (development | production | staging):
```sh
$ yarn build
```



