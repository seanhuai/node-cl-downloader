#!/usr/bin/env node
const fs = require('fs');
const config = require('./config.json');
const downloader = require('./downloader');
const yargs = require('yargs').options({
  'tid': {
    alias: 'i'
  },
  'thread': {
    alias: 't',
    default: config.thread
  },
  'output': {
    alias: 'o',
    default: config.output,
  },
  'enableproxy': {
    type: 'boolean'
  },
  'disableproxy': {
    type: 'boolean'
  },
  'proxyhost': {},
  'proxyport': {}
});

const argscheck = () => {
  if(yargs.argv.enableproxy) {
    config.proxy.noProxy = false;
    fs.writeFileSync('./config.json', JSON.stringify(config));
    return console.log(config.proxy);
  }
  
  if(yargs.argv.disableproxy) {
    config.proxy.noProxy = true;
    fs.writeFileSync('./config.json', JSON.stringify(config));
    return console.log(config.proxy);
  }

  if(yargs.argv.proxyhost) {
    config.proxy.host = yargs.argv.proxyhost;
    fs.writeFileSync('./config.json', JSON.stringify(config));
    return console.log(config.proxy);
  }

  if(yargs.argv.proxyport) {
    config.proxy.port = yargs.argv.proxyport;
    fs.writeFileSync('./config.json', JSON.stringify(config));
    return console.log(config.proxy);
  }
  
  if(yargs.argv.tid == null) console.warn('请输入有效的id');
    else new downloader(yargs.argv);
}

argscheck();