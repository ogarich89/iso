# Iso
Iso is a starter-pack for creating isomorphic single-page application with using SSR technology on NodeJS.

Powered by [ogarich89](https://github.com/ogarich89)

#### Warning

For a comfortable development you will need the knowledge of node.js, React, Redux, Webpack and Koa.

### Tech

ISO uses a number of open source projects to work properly:

* [node.js] - evented I/O for the backend
* [Koa] - fast node.js network app framework
* [React] - JavaScript library for building user interfaces
* [Redux] - predictable state container for JavaScript apps.
* [Webpack] - module bundler
* [Babel] - compiler for writing next generation JavaScript.
* [eslint] - pluggable linting utility for JavaScript and JSX.
* Etc. (See package.json)

And of course ISO itself is open source with a [public repository]
 on GitHub.

# Usage

### Install

ISO requires Node.js v8+ to run.

```sh
$ git clone https://github.com/ogarich89/iso.git <project name>
$ cd <project name>
$ npm install
$ npm run start
```

### Development

1. Create folder 'development' in directory '/config'
2. Create file 'server.json' in folder '/config/development' (example settings in '/config/__example__/server.json')
3. Run each command in a separate terminal tab

```sh
$ npm run client
$ npm run server
$ npm run nodemon
```

#### Building for source
For production release:
```sh
$ npm run production
```
Depending on NODE_ENV (development | production | staging):
```sh
$ npm run build
```



