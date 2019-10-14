#!/usr/bin/env node
const iconv = require('iconv-lite');
const Request = require('request');
const config = require('./config');
// 网络请求环境初始化
const request = config.proxy.noProxy? Request.defaults(): Request.defaults({proxy: `http://${config.proxy.host}:${config.proxy.post}`})
const fs = require('fs');
const cheerio = require('cheerio');
const { installEventListener } = require('./event');

class Downloader {
  constructor(options) {
    const {tid, thread, output} = options;
    this.domain = config.domain;
    this.id = tid || 3666946; // 默认 tid
    this.threads = thread || config.thread;
    this.title, this.urls;
    // 工作目录初始化
    this.path = output || config.output;
    if(!fs.existsSync(this.path)) fs.mkdirSync(this.path);
    // 事件响应模块
    const e = {};
    this.events = installEventListener(e);
    this.eventsInit();
    // 获取页面地址
    this.getPageURL()
  }

  eventsInit() {
    const createMessage = message => {
      message = ` * ${message}`;
      return console.log(message);
    }

    this.events.listen('getPageURL-success', content => {
      createMessage('获取帖子地址，成功');
      this.getPageContent(content);
    });

    this.events.listen('getPageContent-success', content => {
      createMessage(`抓取图片数据 - ${this.urls.length}，成功`)
      // 下载任务输出目录
      if(this.title == null) this.path = `${this.path}/[${this.id}] (${this.urls.length}P)`;
        else { // Windows 目录路径优化
          const reg = /[\\\\/:*?\"<>|]/g;
          this.title = this.title.replace(reg, '');
          this.path = `${this.path}/[${this.id}] ${this.title}`;
        }
      if(!fs.existsSync(this.path)) fs.mkdirSync(this.path);

      createMessage('启动下载任务')
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
      checkHandle();
    });

    this.events.listen('downloadFile-skip', content => {
      skiplist.push(content);
      checkHandle();
    });

    this.events.listen('allDownloadTask-finish', content => {
      let message = `下载任务已完成，成功 ${successlist.length} 项`;
      if(skiplist.length) message = `${message}，跳过 ${skiplist.length} 项`;
      return createMessage(message);
    });
  }

  getSearchURL(id) { return `${this.domain}/read.php?tid=${id}`};
  setPageURL(url) { return `${this.domain}/${url}`};

  getPageURL() {
    request.get(this.getSearchURL(this.id) ,(err, res, body)=>{
      const $ = cheerio.load(body);
      const content = $('meta').last().attr('content');
      const url = content.slice(6);
      this.events.trigger('getPageURL-success', url);
    })
  }

  getPageContent(url) {
    request.get(this.setPageURL(url), {encoding: null}, (err, res, body) => {
      // 将网页数据按 gbk 编码读取，便于中文提取
      const html = iconv.decode(new Buffer(body), 'gbk');
      const $ = cheerio.load(html);
      const urls = [];
      $("[data-src]").each(function(i, elem) {
        const datasrc = $(this).attr('data-src');
        urls[i] = datasrc.replace('.md', '');
      });
      this.urls = urls;
      // 读取标题数据
      this.title = $("h4").first().text();
      this.events.trigger('getPageContent-success');
    })
  }

  setDownloadTasks() {
    for(let i = 0; i < this.threads; i++) this.downloadTask();
  }

  downloadTask() {
    if(this.urls.length <= 0) return;
    const url = this.urls.shift();
    const filename = this.getFileName(url);
    return this.downloadFile(url, filename);
  }

  downloadFile(url, filename) {
    const filepath = `${this.path}/${filename}`;
    if(!fs.existsSync(filepath)) {
      // 请求数据并写入
      request.get(url, {encoding: 'binary', rejectUnauthorized:false, timeout: config.timeout }, (err, res, body) => {
        fs.writeFileSync(filepath, body, 'binary');
        this.events.trigger('downloadFile-success', url);
      })
    } else this.events.trigger('downloadFile-skip', url); 
  }

  getFileName(url) {
    let nameString, filename;
    if(url.indexOf('?') != -1) nameString = url.split('?');
      else nameString = url.split('/');
    filename = nameString[nameString.length - 1];
    return filename.replace('&', '.');
  }
}

module.exports = Downloader;