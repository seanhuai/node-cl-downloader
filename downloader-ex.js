#!/usr/bin/env node
const iconv = require('iconv-lite');
const Request = require('request');
const config = require('./config.json');
// 网络请求环境初始化
const request = config.proxy.noProxy? Request.defaults(): Request.defaults({proxy: `http://${config.proxy.host}:${config.proxy.port}`})
const fs = require('fs');
const { installEventListener } = require('./event');
var ProgressBar = require('progress');

class Downloader {
  constructor(options) {
    const {tid, thread, output} = options;
    this.domain = config.domain;
    this.id = tid || 3666946; // 默认 tid
    this.threads = thread || config.thread;
    this.title, this.urls, this.total, this.bar;
    // 工作目录初始化
    this.path = output || config.output;
    if(!fs.existsSync(this.path)) fs.mkdirSync(this.path);
    // 事件响应模块
    const e = {};
    this.events = installEventListener(e);
    this.eventsInit();
    // 获取下载信息
    this.getDownloadList();
  }

  eventsInit() {
    const createMessage = message => {
      message = ` * ${message}`;
      return console.log(message);
    }

    this.events.listen('getDownloadList-success', content => {
      createMessage(`获取内容 - ${this.title}，成功`)
      createMessage(`获取图片数据 - ${this.total}，成功`)
      // 下载任务输出目录
      if(this.title == null) this.path = `${this.path}/[${this.id}] (${this.total}P)`;
        else { // Windows 目录路径优化
          const reg = /[\\\\/:*?\"<>|]/g;
          this.title = this.title.replace(reg, '');
          this.path = `${this.path}/[${this.id}] ${this.title}`;
        }
      if(!fs.existsSync(this.path)) fs.mkdirSync(this.path);

      createMessage('启动下载任务')
      // 加载进度条
      this.bar = new ProgressBar(' * 下载进度 [:bar] :current :percent', {
        complete: '=',
        incomplete: ' ',
        width: 50,
        total: this.total
      });

      this.threads = this.urls.length < this.threads? this.urls.length: this.threads;
      this.setDownloadTasks();
    });
    
    const skiplist = [], successlist = [];
    const checkHandle = () => {
      if(this.urls.length) this.downloadTask();
        else this.threads--;
      if(!this.threads) this.events.trigger('allDownloadTask-finish');
    }

    this.events.listen('downloadFile-success', content => {
      successlist.push(content);
      this.bar.tick();
      checkHandle();
    });

    this.events.listen('downloadFile-skip', content => {
      skiplist.push(content);
      this.bar.tick();
      checkHandle();
    });

    this.events.listen('allDownloadTask-finish', content => {
      let message = `下载任务已完成，成功 ${successlist.length} 项`;
      if(skiplist.length) message = `${message}，跳过 ${skiplist.length} 项`;
      return createMessage(message);
    });
  }

  getDownloadList() {
    request.get(`https://t66y.mstc.workers.dev/?tid=${this.id}`, {timeout: config.timeout }, (err, res, body) => {
      if(body) {
        const res = JSON.parse(body);
        if(res.status == 200) {
          this.title = res.data.title || '无标题';
          this.urls = res.data.list;
          this.total = res.data.total;
          this.events.trigger('getDownloadList-success');
        }
      }
    })
  }

  setDownloadTasks() {
    for(let i = 0; i < this.threads; i++) this.downloadTask();
  }

  downloadTask() {
    if(this.urls.length <= 0) return;
    const url = config.imageProxy? `${config.imageProxy}${this.urls.shift()}`: this.urls.shift();
    const filename = this.getFileName(url);
    return this.downloadFile(url, filename);
  }

  downloadFile(url, filename) {
    const filepath = `${this.path}/${filename}`;
    if(!fs.existsSync(filepath)) {
      // 请求数据并写入
      request.get(url, {encoding: 'binary', rejectUnauthorized:false, timeout: config.timeout }, (err, res, body) => {
        if(err) throw Error('下载时出现未知错误，请检查网络设置');
        fs.writeFileSync(filepath, body, 'binary');
        this.events.trigger('downloadFile-success', url);
      })
    } else this.events.trigger('downloadFile-skip', url); 
  }

  getFileName(url) {
    let nameString, filename;
    nameString = url.split('/');
    filename = nameString[nameString.length - 1];
    return filename.replace('&', '.');
  }
}

module.exports = Downloader;