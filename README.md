# Iso
Iso is starter-pack for creating isomorphic single-page application with using SSR technology on NodeJS.

Powered by [ogarich89](https://github.com/ogarich89)

> #### Warning
> For a comfortable development you will need the knowledge of React, Recoil and Koa.

### Tech

ISO uses a number of open source projects to work properly:

* [Node.js](https://nodejs.org/) - evented I/O for the backend
* [Typescript](https://www.typescriptlang.org/) - typed JavaScript at Any Scale.
* [Koa](https://koajs.com/) - fast node.js network app framework
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

ISO requires [Node.js](https://nodejs.org/) v16+ and [Redis](https://redis.io) to run.


```sh
$ git clone https://github.com/ogarich89/iso.git <project name>
$ cd <project name>
$ yarn install
$ yarn start
```

### Development

1. Create folder 'development' in directory '/config'
2. Create file 'server.json' in folder '/config/development' (example settings in '/config/\_\_example\_\_/server.json')
3. Run each command in a separate terminal tab

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



