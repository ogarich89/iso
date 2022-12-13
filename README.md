# Iso
Iso is starter-pack for creating isomorphic single-page application with using SSR technology on NodeJS.

Powered by [ogarich89](https://github.com/ogarich89)

> #### Warning
> For a comfortable development you will need the knowledge of React, Recoil and Fastify.

### Tech

ISO uses a number of open source projects to work properly:

* [Node.js](https://nodejs.org/) - evented I/O for the backend
* [Typescript](https://www.typescriptlang.org/) - typed JavaScript at Any Scale.
* [Fastify](https://www.fastify.io/) - Fast and low overhead web framework, for Node.js
* [React](https://reactjs.org/) - JavaScript library for building user interfaces
* [Recoil](https://recoiljs.org/) - A state management library for React
* [Webpack](https://webpack.js.org/) - module bundler
* [SWC](https://swc.rs/) - Rust-based platform for the Web
* [ESLint](https://eslint.org/) - pluggable linting utility for JavaScript and JSX.
* [Loadable-components](https://www.smooth-code.com/open-source/loadable-components/) - React code splitting library.
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
$ yarn start
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
 "host": "http://localhost:3000",
 "browserSyncPort": 3003,
 "api": "https://reqres.in",
 "sessionRedisDb": 2,
 "production": false,
 "withStatic": true,
 "withRedis": false,
 "inspect": true,
 "logger": true
}
```

`port` - Node.js server port \
`host` - Site hostname \
`browserSyncPort` - Development proxy server port with browserSync and HMR \
`api` - Backend API hostname \
`sessionRedisDb` - Redis database index \
`production` - Webpack production mode \
`withStatic` - Serve static files with NodeJS server \
`withRedis` - Session with Redis store \
`inspect` - Debugging Node.js with Chrome DevTools \
`logger` - Fastify logger \

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

#### Building for source
For production release:
```sh
$ yarn production
```
Depending on NODE_ENV (development | production | staging):
```sh
$ yarn build
```



