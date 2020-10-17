# Iso
Iso is starter-pack for creating isomorphic single-page application with using SSR technology on NodeJS.

Powered by [ogarich89](https://github.com/ogarich89)

> #### Warning
> For a comfortable development you will need the knowledge of React, Redux and Koa.

### Tech

ISO uses a number of open source projects to work properly:

* [Node.js](https://nodejs.org/en/) - evented I/O for the backend
* [Koa](https://koajs.com/) - fast node.js network app framework
* [React](https://reactjs.org/) - JavaScript library for building user interfaces
* [Redux](https://redux.js.org/) - predictable state container for JavaScript apps.
* [Webpack](https://webpack.js.org/) - module bundler
* [Babel](https://babeljs.io/) - compiler for writing next generation JavaScript.
* [ESLint](https://eslint.org/) - pluggable linting utility for JavaScript and JSX.
* [Loadable-components](https://www.smooth-code.com/open-source/loadable-components/) - React code splitting library.
* Etc. (See package.json)

And of course ISO itself is open source with a [public repository]
 on GitHub.

# Usage

### Install

ISO requires Node.js v8+ to run.

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

#### Building for source
For production release:
```sh
$ yarn production
```
Depending on NODE_ENV (development | production | staging):
```sh
$ yarn build
```



