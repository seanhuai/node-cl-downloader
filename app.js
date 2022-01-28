#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
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
  'proxy': {},
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
  if(yargs.argv.proxy) {
    return console.log(config.proxy);
  }

  if(yargs.argv.enableproxy) {
    config.proxy.noProxy = false;
    fs.writeFileSync(path.resolve(__dirname,'config.json'), JSON.stringify(config));
    return console.log(config.proxy);
  }

  if(yargs.argv.disableproxy) {
    config.proxy.noProxy = true;
    fs.writeFileSync(path.resolve(__dirname,'config.json'), JSON.stringify(config));
    return console.log(config.proxy);
  }
  
  if(yargs.argv.proxyhost) {
    config.proxy.host = yargs.argv.proxyhost;
    fs.writeFileSync(path.resolve(__dirname,'config.json'), JSON.stringify(config));
    return console.log(config.proxy);
  }

  if(yargs.argv.proxyport) {
    config.proxy.port = yargs.argv.proxyport;
    fs.writeFileSync(path.resolve(__dirname,'config.json'), JSON.stringify(config));
    return console.log(config.proxy);
  }
  
  if(yargs.argv.tid == null) console.warn('请输入有效的id');
    else new downloader(yargs.argv);
}

argscheck();