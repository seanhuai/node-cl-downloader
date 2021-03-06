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

### 全局安装位置

全局安装后如需修改项目配置文件 config.js 时，使用 `npm config get prefix` 查询全局仓库目录。

Windows 环境下全局仓库位于 
```
  {prefix}/node_modules/node-cl-downloader
```

Linux 环境下全局仓库位于 

```
  {prefix}/lib/node_modules/node-cl-downloader
```

## 代理 Proxy

在 config.js 文件根据实际网络需要修改代理服务器和端口，如所在网络无需代理，请修改 noProxy 属性值。

*关于 config.js 文件位置的内容，参考 [全局安装位置](#全局安装位置) 一节。* 

## 示例 Examples

在默认代理（代理地址为本地，端口 1080）的条件下，下载论坛贴子（以 id3666946 为例）的图片到默认文件夹，命令如下：

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

在设定选项时需要注意以下几点：

1. 如果需要设置一些常用选项时，可以在 `config.js` 文件替换默认值，修改后可以不用再进行选项设置。
2. 由于境内众所周知的网络情况，程序默认是使用代理工作的；对于无需使用代理的用户，可以修改 `config.js` 文件的 `proxy.noProxy` 属性，该属性与代理服务器地址、代理服务器端口两属性冲突。

*关于 config.js 文件位置的内容，参考 [全局安装位置](#全局安装位置) 一节。* 

## 协议 License

此项目遵守 The MIT License。

根据协议，你可以使用，复制和修改软件；可以用于个人项目或商业项目；使用此项目源码必须附带版权声明，即原作者署名。