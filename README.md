# cyc

Scaffold an isomorphic Cycle.js app in seconds.

*cyc* provides a starting point for Cycle.js applications. It comes with production and development webpack configurations, hot module reloading, server reloading, Babel transpilation, and an isomorphic express server.

[View the live preview.](http://edge.github.io/cyc/)

## Installing

```sh
$ npm install -g cyc-cli babel-cli
```

## Scaffolding a Project

```sh
$ cyc
  Application Name myapp
  Directory (myapp)
  Copying...
  Populating...
  Done.
$ cd myapp
$ npm i
```

## Running a Project

**Development**
```sh
$ npm run dev
```

**Production**
```sh
$ npm run build
$ PORT=80 npm start
```
