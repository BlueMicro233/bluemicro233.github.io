'use strict';

/**
 * Protect math from the Markdown renderer.
 *
 * Without this, marked turns `\\` inside inline matrices into line breaks and
 * mangles `_`, `*`, etc. Display math is also affected when it is not wrapped
 * in a raw HTML block. Math is replaced with an opaque placeholder before
 * Markdown runs and restored to `$...$` / `$$...$$` afterwards for MathJax.
 */

const PLACEHOLDER_RE = /<(span|div)\b[^>]*class="[^"]*math-placeholder[^"]*"[^>]*data-display="([01])"[^>]*data-math="([A-Za-z0-9_-]+)"[^>]*><\/\1>/g;

function encodeMath(expression) {
  return Buffer.from(expression, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function decodeMath(encoded) {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64').toString('utf8');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function placeholder(expression, display) {
  const classes = display
    ? 'math-placeholder math-placeholder-display'
    : 'math-placeholder';
  const tag = display ? 'div' : 'span';
  return `<${tag} class="${classes}" data-display="${display ? '1' : '0'}" data-math="${encodeMath(expression)}"></${tag}>`;
}

hexo.extend.filter.register('before_post_render', function (data) {
  let text = String(data.content || '');
  const stashed = [];

  const stash = (prefix, value) => {
    const token = `@@${prefix}${stashed.length}@@`;
    stashed.push({ token, value });
    return token;
  };

  // Keep code blocks and inline code away from the math scanner.
  text = text.replace(
    /(^|\n)([ \t]{0,3})(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2\3[ \t]*(?=\n|$)/g,
    match => stash('CODEBLOCK', match)
  );
  text = text.replace(/(`+)([^`\n]*?)\1/g, match => stash('INLINECODE', match));
  text = text.replace(/<(pre|code|script|style)\b[\s\S]*?<\/\1>/gi, match => stash('RAWCODE', match));

  // Display math first, then inline math.
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, expression) => placeholder(expression, true));
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (match, expression) => placeholder(expression, true));
  text = text.replace(/(?<!\\)\$((?:(?!\n[ \t]*\n)[\s\S])+?)\$/g, (match, expression) => placeholder(expression, false));
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, (match, expression) => placeholder(expression, false));

  for (let i = stashed.length - 1; i >= 0; i--) {
    text = text.split(stashed[i].token).join(stashed[i].value);
  }

  data.content = text;
  return data;
}, 5);

hexo.extend.filter.register('after_post_render', function (data) {
  data.content = String(data.content || '').replace(
    PLACEHOLDER_RE,
    (match, tag, display, encoded) => {
      const expression = escapeHtml(decodeMath(encoded));
      if (display === '1') {
        return `<div class="math-display">$$${expression}$$</div>`;
      }
      return `$${expression}$`;
    }
  );

  return data;
}, 5);
