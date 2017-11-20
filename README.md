# lemon-ts

[![Greenkeeper badge](https://badges.greenkeeper.io/Yellowiki/lemon-ts.svg)](https://greenkeeper.io/)

## Simplify your TypeScript development
---

### Install to an existing project
```
npm i -D lemon-ts
```
Add scripts in your `package.json`:
```json
"scripts": {
  "build": "lemon-ts build",
  "prettify": "lemon-ts prettify",
  "test": "lemon-ts test"
}
```
### Generate a new project
Use `generator-lemon-ts` to easily generate a new project
```
npm i -g yo generator-lemon-ts

# In an empty folder
yo lemon-ts
```