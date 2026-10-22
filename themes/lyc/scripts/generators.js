'use strict';

function stripHtml(html) {
  return String(html || '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<figure class="highlight[\s\S]*?<\/figure>/gi, ' ')
    .replace(/&#x([0-9a-f]+);/gi, function (match, hex) {
      return String.fromCodePoint(parseInt(hex, 16));
    })
    .replace(/&#(\d+);/g, function (match, dec) {
      return String.fromCodePoint(parseInt(dec, 10));
    })
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\\\[[\s\S]*?\\\]/g, ' ')
    .replace(/\$[^$\n]+\$/g, ' ')
    .replace(/\\\([^)]*?\\\)/g, ' ')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

hexo.extend.generator.register('search_index', function (locals) {
  const root = this.config.root || '/';
  const posts = locals.posts.sort('-date').map(function (post) {
    const tags = [];
    post.tags.each(function (tag) { tags.push(tag.name); });
    const categories = [];
    post.categories.each(function (category) { categories.push(category.name); });
    return {
      title: post.title,
      url: root + post.path,
      date: post.date.format('YYYY-MM-DD'),
      tags: tags,
      categories: categories,
      text: stripHtml(post.content).slice(0, 8000)
    };
  });

  return {
    path: 'search.json',
    data: JSON.stringify(posts)
  };
});
