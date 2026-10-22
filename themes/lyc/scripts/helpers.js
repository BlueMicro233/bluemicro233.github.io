'use strict';

/**
 * Whether a navigation item points at the current page.
 */
hexo.extend.helper.register('is_active', function (target) {
  const page = this.page;
  const path = (page.path || '').replace(/index\.html$/, '');
  const normalized = target.replace(/^\/+|\/+$/g, '');
  if (!normalized) {
    return page.layout === 'index' || path === '' || /^page\/\d+\/$/.test(path);
  }
  if (normalized === 'archives') {
    return page.archive === true || path.indexOf('archives/') === 0;
  }
  if (normalized === 'tags') {
    return path.indexOf('tags/') === 0 || typeof page.tag !== 'undefined';
  }
  if (normalized === 'categories') {
    return path.indexOf('categories/') === 0 || typeof page.category !== 'undefined';
  }
  return path === normalized + '/' || path.indexOf(normalized + '/') === 0;
});

/**
 * Page title used in <title>.
 */
hexo.extend.helper.register('page_title', function () {
  const page = this.page;
  const config = this.config;
  if (page.layout === 'index' || !page.title) {
    return config.title + ' · ' + config.subtitle;
  }
  return page.title + ' · ' + config.title;
});

/**
 * Rough reading time (Chinese characters + English words).
 */
hexo.extend.helper.register('reading_time', function (content) {
  if (!content) return 1;
  const text = content.replace(/<pre[\s\S]*?<\/pre>/g, ' ').replace(/<[^>]+>/g, ' ');
  const cjk = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const words = (text.replace(/[\u4e00-\u9fff]/g, ' ').match(/[A-Za-z0-9_]+/g) || []).length;
  return Math.max(1, Math.round(cjk / 400 + words / 200));
});

/**
 * Format a tag list with links.
 */
hexo.extend.helper.register('tag_links', function (tags) {
  const urlFor = this.url_for.bind(this);
  const out = [];
  tags.each(function (tag) {
    out.push('<a class="tag-link" href="' + urlFor(tag.path) + '">' + tag.name + '</a>');
  });
  return out.join('');
});

hexo.extend.helper.register('category_links', function (categories) {
  const urlFor = this.url_for.bind(this);
  const out = [];
  categories.each(function (category) {
    out.push('<a class="category-link" href="' + urlFor(category.path) + '">' + category.name + '</a>');
  });
  return out.join('');
});
