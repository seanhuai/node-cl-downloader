# node-cl-downloader

[![github license](https://img.shields.io/github/license/seanhuai/node-cl-downloader)](https://github.com/seanhuai/node-cl-downloader/blob/master/LICENSE)
[![gitHub package version](https://img.shields.io/github/package-json/v/seanhuai/node-cl-downloader?color=%23e74c3c)](https://github.com/seanhuai/node-cl-downloader)
[![npm version](https://img.shields.io/npm/v/node-cl-downloader)](https://www.npmjs.com/package/node-cl-downloader)
[![npm downloads](https://img.shields.io/npm/dt/node-cl-downloader?color=%233498db)](https://www.npmjs.com/package/node-cl-downloader)
[![GitHub stars](https://img.shields.io/github/stars/seanhuai/node-cl-downloader?style=social)](https://github.com/seanhuai/node-cl-downloader)

这是一个使用 JavaScript 完成的 T66Y 图片资源下载工具。

## 安装 Install

安装需要 Node.Js 环境，可在 [官方网站下载](https://nodejs.org/en/download/)。

下载安装命令如下：

```shell
  // npm global 全局安装
  npm install -g node-cl-downloader

  // git 安装
  git clone https://github.com/seanhuai/node-cl-downloader
  cd node-cl-downloader
  npm install && npm link
```

*Linux 用户需要注意程序的读写和执行权限。*

当上述命令执行完毕后，可以在本地全局调用 `cl-downloader` 命令，在任何位置执行下载操作。

## 代理 Proxy

初始代理地址为本地，端口 1080，默认为关闭状态。

查看当前代理状态：

```
  cl-downloader --proxy
```

变更代理状态如下操作：

```shell
  // 如需启用代理
  cl-downloader --enableproxy
  
  // 如需停用代理
  cl-downloader --disableproxy
  
  // 如需变更代理地址
  cl-downloader --proxyhost 127.0.0.1
  // 其中 127.0.0.1 为样例数据，需根据实际情况修改

  // 如需变更代理服务端口
  cl-downloader --proxyport 1080
  // 其中 1080 为样例数据，需根据实际情况修改
```

## 示例 Examples

下载论坛贴（以 id3666946 为例）的图片到默认文件夹，命令如下：

```shell
  cl-downloader -i 3666946
```

下载上述内容到特定文件夹，命令如下：

```shell
  cl-downloader -i 3666946 -o fsfolder
```

同时进行多个（以 4 为例）文件下载上述内容，命令如下：

```shell
  cl-downloader -i 3666946 -t 4
```

## 选项 Options

使用选项为程序传递更多信息

* `--help` 获取帮助信息；
* `-i/--tid`  设置需要下载的帖子 id；
* `-t/--thread`  设置同时下载的工作数，默认为 `4`；
* `-o/--output`  设置存放下载内容的目录名，默认为 `1024`；

上述选项可同时使用，**下列选项涉及默认配置变更，不可同时使用**

* `--enableproxy`  启用代理； 
* `--disableproxy`  停用代理；
* `--proxyhost`  设置代理服务地址； 
* `--proxyport`  启用代理服务端口； 

## 协议 License

此项目遵守 The MIT License。

根据协议，你可以使用，复制和修改软件；可以用于个人项目或商业项目；使用此项目源码必须附带版权声明，即原作者署名。