#!/usr/bin/env node
const config = require('./config');
const downloader = require('./downloader');
const yargs = require('yargs').options({
  'tid': {
    alias: 'i'
  },
  'thread': {
    alias: 't',
    default: config.thread,
    description: 'Set threads for download.'
  },
  'output': {
    alias: 'o',
    default: config.output,
    description: 'Set output folder.'
  }
});

if(yargs.argv.tid == null) console.warn('请输入有效的id');
  else new downloader(yargs.argv);