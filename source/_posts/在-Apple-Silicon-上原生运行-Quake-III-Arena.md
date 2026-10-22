---
title: 在 Apple Silicon 上原生运行《雷神之锤 3》
date: 2025-11-29 23:19:19
tags: 技术
---

## 前置工作

1. 一份在 Windows 平台下载的原版 Quake III Arena 的游戏文件。 

2. 在 ioquake3.org/get-it/ 下载一份**基于 Universal 2 Build** 的 macOS build 文件。

3. 在 ioquake3.org/extras/patch-data 下载一个 zip 文件（将自动解压为 quake3-latest-pk3s 文件夹）。

这两个部分准备好了，就可以正式安装了。


## 安装

1. 在“应用程序”文件夹中创建一个名为 ioquake3 的文件夹。

2. 将下载的文件（ioquake3.app）移动到刚刚创建的 ioquake3 文件夹内。

3. 把下载的 quake3-latest-pk3s 文件夹内的两个文件夹解压至 ioquake3 文件夹内。

4. 把 Windows 上的 pak0.pk3 资产文件复制下来，并且转移到 mac 上。

## 进一步配置

运行 ioquake3 进入游戏，它会提示输入 CD-KEY，可以直接回车键跳过。

此时，屏幕分辨率是个问题，并且有人可能还不在全屏模式，需要在控制台调整。**id tech 引擎呼出控制台为 `~` 键。**

我的 MacBook Air 的分辨率是 2560*1664，所以逐个输入以下指令：

`/r_mode -1`

`/r_customheight 1664`

`/r_customwidth 2560`

应用分辨率，输入：

`/vid_restart`

并且还需要进入全屏模式，所以需要输入：

`/r_fullscreen 1`

至此，游戏配置就差不多了。我们还可以在自带的 SYSTEM 设置里设置画质，例如纹理过滤模式、光照模式、几何细节等等。

## 针对 macOS 26 没有声音的问题

在 macOS 26 上运行具有 OpenAL 音频库的程序存在兼容性问题，于是游戏无法正常播放声音。解决方法也很简单，只需输入以下指令禁用 OpenAL 库并应用：

`/s_useOpenAL 0`

`/snd_restart`