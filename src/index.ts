#!/usr/bin/env node

import 'hard-rejection/register'

import execa = require('execa')
import fsExtra = require('fs-extra')
import globPromise = require('glob-promise')
import * as os from 'os'
import * as path from 'path'
import yargs = require('yargs')

const glob = '{src,test}/**/*.ts'
const tslintConfig = path.resolve(__dirname, '../tslint.json')

function exec(file, options) {
  const p = execa(file, options)
  p.stdout.pipe(process.stdout)
  p.stderr.pipe(process.stderr)
  return p
}

const { argv } = yargs
  .command(
    'build',
    'build TypeScript project',
    y => y,
    async () => {
      await exec('tsc', [
        '--pretty',
        '--module',
        'commonjs',
        '--target',
        'es5',
        '--lib',
        'es2015,es2017,esnext',
        '--outDir',
        'dist',
        '--strict',
        '--declaration',
        '--noImplicitAny',
        'false',
        ...(await globPromise.promise('src/**/*.ts')),
      ])
      if (os.platform() !== 'win32') {
        try {
          await fsExtra.chmod('dist/index.js', '755')
        } catch (e) {}
      }
    },
  )
  .command(
    'prettify',
    'prettify TypeScript project',
    y => y,
    async () => {
      await exec('prettier', [
        'fix',
        glob,
        '--write',
        '--no-semi',
        '--single-quote',
        '--trailing-comma',
        'all',
        '--no-config',
      ])
      await exec('tslint', ['--fix', '--config', tslintConfig, glob])
      await exec('prettier', ['package.json', '--write'])
    },
  )
  .command(
    'lint',
    'lint TypeScript project',
    y => y,
    async () => {
      await exec('tslint', ['--config', tslintConfig, glob])
    },
  )
  .demandCommand(1)
