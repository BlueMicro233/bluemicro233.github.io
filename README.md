# 布朗尼蛋糕的博客

基于 [Hexo](https://hexo.io/) 重构的个人博客，视觉风格参考 [blog.lyc8503.net](https://blog.lyc8503.net/)：等宽字体、绿色强调色、右侧目录与代码高亮，支持深色 / 浅色两套配色。

## 本地运行

```bash
npm install
npm run start
```

打开 <http://localhost:4000/>。修改文章或主题后浏览器刷新即可，Hexo 会自动重新生成。

生成静态文件：

```bash
npm run build   # 输出到 public/
```

## 目录结构

```
_config.yml              # 站点配置（标题、描述、URL、永久链接等）
source/
  _posts/                # 文章 Markdown 与同名图片目录
  images/                # 站点图片（头像等）
  about/                 # 关于页
  links/                 # 友链页
  tags/                  # 标签云页
  categories/            # 分类页
  search/                # 搜索页
themes/lyc/
  _config.yml            # 主题配置（导航、首页介绍、版权）
  layout/                # EJS 模板
  source/css/style.css   # 深色模式样式
  source/css/light.css   # 浅色模式样式（cactus light 配色）
  source/js/main.js      # 主题切换、目录、代码复制、搜索等脚本
  source/lib/            # 本地化的 Font Awesome 与 MathJax
```

## 常用修改

- **站点标题 / 副标题 / 描述**：编辑根目录 `_config.yml` 的 `title`、`subtitle`、`description`。
- **首页自我介绍、导航**：编辑 `themes/lyc/_config.yml`。
- **深色 / 浅色配色**：深色在 `themes/lyc/source/css/style.css`，浅色在 `themes/lyc/source/css/light.css`。右上角的按钮会记住访客的选择（localStorage），默认深色。
- **友链**：编辑 `source/links/index.md` 中的卡片。
- **关于页**：编辑 `source/about/index.md`。

## 写文章

在 `source/_posts/` 新建 Markdown 文件（文件名会成为 URL）：

```markdown
---
title: 文章标题
date: 2026-10-23 12:00:00
tags: [技术, 学习]
mathjax: true
---

正文……
```

- 需要数学公式时在 front-matter 加 `mathjax: true`，支持 `$...$` 与 `$$...$$`。
- 图片放在与文章同名的文件夹中，例如 `source/_posts/文章标题/图片.png`，然后在正文中使用：

```markdown
<figure>
  {% asset_img 图片.png 图片说明 %}
  <figcaption>图片说明</figcaption>
</figure>
```

- 文章的 `tags` 会显示在标签页；也可以添加 `categories` 字段使用分类页。

## 部署

1. 修改 `_config.yml` 中的 `url` 为线上域名。
2. 执行 `npm run build`，将 `public/` 部署到任意静态托管（GitHub Pages、Cloudflare Pages、Vercel、Nginx 等）。
3. 也可以安装对应 deployer 插件，在 `_config.yml` 的 `deploy` 中配置后执行 `npm run deploy`。

> 部署时请确保服务器为 `.xml` 文件返回 `charset=utf-8`（Nginx 可配置 `charset utf-8;`）。本地 `hexo server` 已通过 `themes/lyc/scripts/server.js` 自动补上，否则部分浏览器直接打开 `atom.xml` 时会按 Latin-1 解码而显示乱码。

## 说明

- Font Awesome 与 MathJax 已本地化到主题中，不依赖 CDN。
- 本站不开放评论系统，主题未集成任何评论组件。
