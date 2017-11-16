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

const { argv } = yargs
  .command(
    'build',
    'build TypeScript project',
    y => y,
    async () => {
      await execa('tsc', [
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
        '--listFiles',
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
      await execa('prettier', [
        'fix',
        glob,
        '--write',
        '--no-semi',
        '--single-quote',
        '--trailing-comma',
        'all',
        '--no-config',
      ])
      await execa('tslint', ['--fix', '--config', tslintConfig, glob])
      await execa('prettier', ['package.json', '--write'])
    },
  )
  .command(
    'lint',
    'lint TypeScript project',
    y => y,
    async () => {
      await execa('tslint', ['--config', tslintConfig, glob])
    },
  )
  .demandCommand(1)
