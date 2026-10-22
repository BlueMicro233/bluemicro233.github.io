'use strict';

/**
 * Add an empty anchor after heading tags so headings can be linked to.
 */
hexo.extend.filter.register('after_post_render', function (data) {
  data.content = data.content.replace(
    /<h([2-4]) id="([^"]+)">/g,
    '<h$1 id="$2"><a href="#$2" class="headerlink" aria-label="Permalink"></a>'
  );

  // Make images lazy-loaded, except when they are the only content of a link.
  data.content = data.content.replace(/<img (?![^>]*\bloading=)/g, '<img loading="lazy" ');

  // Let wide tables scroll horizontally.
  data.content = data.content.replace(/<table>([\s\S]*?)<\/table>/g, function (match, inner) {
    if (match.indexOf('<table><tr><td class="gutter">') !== -1) return match;
    return '<div class="table-wrap"><table>' + inner + '</table></div>';
  });

  return data;
});
