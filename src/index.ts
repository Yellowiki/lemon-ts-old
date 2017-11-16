#!/usr/bin/env node

import 'hard-rejection/register'

import execa = require('execa')
import fsExtra = require('fs-extra')
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
      const tsConfigPath = path.resolve(__dirname, '../tsconfig.json')
      await fsExtra.copy(tsConfigPath, 'tsconfig.json')
      await execa('tsc', ['--pretty'])
      await fsExtra.unlink('tsconfig.json')
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
