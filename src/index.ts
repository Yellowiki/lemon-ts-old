#!/usr/bin/env node

import 'hard-rejection/register'

import execa = require('execa')
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
        '--project',
        path.resolve(__dirname, '../tsconfig.json'),
      ])
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
