'use strict';

/**
 * Make images lazy-loaded, except when they are the only content of a link.
 */
hexo.extend.filter.register('after_post_render', function (data) {
  data.content = data.content.replace(/<img (?![^>]*\bloading=)/g, '<img loading="lazy" ');

  // Let wide tables scroll horizontally.
  data.content = data.content.replace(/<table>([\s\S]*?)<\/table>/g, function (match, inner) {
    if (match.indexOf('<table><tr><td class="gutter">') !== -1) return match;
    return '<div class="table-wrap"><table>' + inner + '</table></div>';
  });

  return data;
});
