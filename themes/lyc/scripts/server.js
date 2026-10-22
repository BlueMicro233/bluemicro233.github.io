'use strict';

/**
 * Hexo's dev server sends `application/atom+xml` without a charset, which makes
 * some browsers (e.g. Edge/Chrome) decode the UTF-8 feed as Latin-1 and show
 * mojibake. Add the charset to XML/JSON responses while serving locally.
 *
 * When deploying to a static host, make sure it also sends
 * `charset=utf-8` for .xml files (Nginx: `charset utf-8;`).
 */
hexo.extend.filter.register('server_middleware', function (app) {
  const root = (this.config.root || '/').replace(/\/+$/, '');
  const feed = this.config.feed || {};
  const feedPath = feed.path ? root + '/' + feed.path.replace(/^\/+/, '') : '';

  app.use(function (req, res, next) {
    const pathname = (req.url || '').split('?')[0];

    if (/\.xml$/i.test(pathname)) {
      let type = 'application/xml';
      if (pathname === feedPath) {
        type = feed.type === 'rss' ? 'application/rss+xml' : 'application/atom+xml';
      }
      res.setHeader('Content-Type', type + '; charset=utf-8');
    } else if (/\.json$/i.test(pathname)) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }

    next();
  });
}, 1);
