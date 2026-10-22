(function () {
  'use strict';

  /* -----------------------------------------------------------------------
   * Theme toggle (dark / light)
   * -------------------------------------------------------------------- */
  var themeToggle = document.getElementById('theme-toggle');
  var rootElement = document.documentElement;
  var themeColorMeta = document.querySelector('meta[name="theme-color"]');

  var applyTheme = function (theme) {
    rootElement.setAttribute('data-theme', theme);

    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme === 'light' ? '#e2e0de' : '#1d1f21');
    }

    if (themeToggle) {
      var isLight = theme === 'light';
      var label = isLight ? '切换到深色模式' : '切换到浅色模式';
      themeToggle.setAttribute('aria-label', label);
      themeToggle.setAttribute('title', label);
      themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    }
  };

  var storedTheme = null;
  try { storedTheme = localStorage.getItem('theme'); } catch (error) { /* ignore */ }
  var initialTheme = (storedTheme === 'light' || rootElement.getAttribute('data-theme') === 'light')
    ? 'light'
    : 'dark';
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var nextTheme = rootElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
      try { localStorage.setItem('theme', nextTheme); } catch (error) { /* ignore */ }
    });
  }

  /* -----------------------------------------------------------------------
   * Mobile navigation (regular pages)
   * -------------------------------------------------------------------- */
  var menuToggle = document.getElementById('menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', function (event) {
      event.preventDefault();
      var list = document.querySelector('#header #nav > ul');
      if (list) list.classList.toggle('responsive');
    });
  }

  /* -----------------------------------------------------------------------
   * Post page: fixed menu / TOC
   * -------------------------------------------------------------------- */
  var postMenu = document.getElementById('menu');
  var postMenuIcon = document.getElementById('menu-icon');
  var postTopIcon = document.getElementById('top-icon-tablet');

  if (postMenu && postMenuIcon) {
    if (window.innerWidth >= 1200) {
      postMenu.style.display = 'block';
      postMenuIcon.classList.add('active');
    }

    postMenuIcon.addEventListener('click', function (event) {
      event.preventDefault();
      var visible = postMenu.style.display !== 'none' && postMenu.style.display !== '';
      postMenu.style.display = visible ? 'none' : 'block';
      postMenuIcon.classList.toggle('active', !visible);
    });

    var navInMenu = postMenu.querySelector('#nav');
    window.addEventListener('scroll', function () {
      if (!navInMenu) return;
      if (window.scrollY > 100) {
        navInMenu.style.display = 'none';
      } else {
        navInMenu.style.display = '';
      }

      if (postTopIcon) {
        if (window.scrollY > 300) {
          postTopIcon.style.display = 'block';
        } else {
          postTopIcon.style.display = 'none';
        }
      }
    }, { passive: true });
  }

  /* -----------------------------------------------------------------------
   * Scrollspy for the table of contents
   * -------------------------------------------------------------------- */
  var tocLinks = Array.prototype.slice.call(
    document.querySelectorAll('#toc a.toc-link, #toc-footer a.toc-link')
  );

  if (tocLinks.length) {
    var headings = tocLinks.map(function (link) {
      var href = link.getAttribute('href') || '';
      if (href.charAt(0) !== '#') return null;
      var id = href.slice(1);
      try { id = decodeURIComponent(id); } catch (err) { /* ignore */ }
      return document.getElementById(id);
    });

    var setActive = function () {
      var index = -1;
      for (var i = 0; i < headings.length; i++) {
        if (headings[i] && headings[i].getBoundingClientRect().top <= 120) {
          index = i;
        }
      }
      tocLinks.forEach(function (link, i) {
        var li = link.parentElement;
        if (!li) return;
        li.classList.toggle('active', i === index);
      });
    };

    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }

  /* -----------------------------------------------------------------------
   * Copy code button
   * -------------------------------------------------------------------- */
  document.querySelectorAll('figure.highlight').forEach(function (box) {
    var codeCell = box.querySelector('td.code');
    if (!codeCell) return;

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn-copy';
    button.setAttribute('aria-label', 'Copy to clipboard');
    button.innerHTML = '<i class="fa-regular fa-clone"></i>';
    box.insertBefore(button, box.firstChild);

    button.addEventListener('click', function () {
      var lines = Array.prototype.slice.call(codeCell.querySelectorAll('.line'));
      var text = lines.length
        ? lines.map(function (line) { return line.textContent; }).join('\n')
        : codeCell.innerText;

      var done = function () {
        button.innerHTML = '<i class="fa-solid fa-check"></i>';
        button.setAttribute('aria-label', 'Copied!');
        setTimeout(function () {
          button.innerHTML = '<i class="fa-regular fa-clone"></i>';
          button.setAttribute('aria-label', 'Copy to clipboard');
        }, 1500);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done);
      } else {
        var area = document.createElement('textarea');
        area.value = text;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        try { document.execCommand('copy'); done(); } catch (err) { /* ignore */ }
        document.body.removeChild(area);
      }
    });
  });

  /* -----------------------------------------------------------------------
   * Copy current post link
   * -------------------------------------------------------------------- */
  var shareLink = document.getElementById('share-link');
  if (shareLink) {
    shareLink.addEventListener('click', function (event) {
      event.preventDefault();
      var done = function () {
        shareLink.innerHTML = '<i class="fa-solid fa-check"></i>';
        shareLink.setAttribute('title', 'Copied!');
        setTimeout(function () {
          shareLink.innerHTML = '<i class="fa-solid fa-link"></i>';
          shareLink.setAttribute('title', 'Copy link');
        }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href).then(done);
      }
    });
  }

  /* -----------------------------------------------------------------------
   * Mobile bottom bar
   * -------------------------------------------------------------------- */
  var footer = document.getElementById('footer-post');
  if (footer) {
    var panels = {
      menu: document.getElementById('nav-footer'),
      toc: document.getElementById('toc-footer')
    };
    var buttons = {
      menu: document.getElementById('footer-menu'),
      toc: document.getElementById('footer-toc')
    };
    var footerTop = document.getElementById('footer-top');

    var hidePanels = function () {
      Object.keys(panels).forEach(function (key) {
        if (panels[key]) panels[key].style.display = 'none';
      });
    };

    Object.keys(buttons).forEach(function (key) {
      if (!buttons[key]) return;
      buttons[key].addEventListener('click', function (event) {
        event.preventDefault();
        var panel = panels[key];
        if (!panel) return;
        var visible = panel.style.display !== 'none';
        hidePanels();
        panel.style.display = visible ? 'none' : 'block';
      });
    });

    if (footerTop) {
      footerTop.addEventListener('click', function (event) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      window.addEventListener('scroll', function () {
        footerTop.style.display = window.scrollY > 300 ? 'inline-block' : 'none';
      }, { passive: true });
    }
  }

  /* -----------------------------------------------------------------------
   * Search
   * -------------------------------------------------------------------- */
  var searchInput = document.getElementById('search-input');
  if (searchInput) {
    var resultList = document.querySelector('#search-result .search-result-list');
    var noResult = document.getElementById('search-no-result');
    var posts = [];
    var searchUrl = window.__SEARCH_URL__ || '/search.json';

    var escapeHtml = function (value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    var highlight = function (text, terms) {
      var out = escapeHtml(text);
      terms.forEach(function (term) {
        if (!term) return;
        var safe = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        out = out.replace(new RegExp(safe, 'gi'), function (match) {
          return '<em class="search-keyword">' + match + '</em>';
        });
      });
      return out;
    };

    var excerpt = function (text, terms) {
      var lower = text.toLowerCase();
      var index = -1;
      terms.forEach(function (term) {
        var found = lower.indexOf(term);
        if (found !== -1 && (index === -1 || found < index)) index = found;
      });
      if (index === -1) index = 0;
      var start = Math.max(0, index - 60);
      var end = Math.min(text.length, index + 220);
      return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
    };

    var render = function () {
      var query = searchInput.value.trim().toLowerCase();
      resultList.innerHTML = '';

      if (!query) {
        noResult.style.display = 'none';
        return;
      }

      var terms = query.split(/\s+/).filter(Boolean);
      var matches = [];

      posts.forEach(function (post) {
        var haystack = (post.title + ' ' + post.tags.join(' ') + ' ' +
          post.categories.join(' ') + ' ' + post.text).toLowerCase();
        if (!terms.every(function (term) { return haystack.indexOf(term) !== -1; })) return;

        var score = 0;
        terms.forEach(function (term) {
          var inTitle = post.title.toLowerCase().indexOf(term) !== -1;
          score += inTitle ? 20 : 0;
          score += haystack.split(term).length - 1;
        });
        matches.push({ post: post, score: score });
      });

      matches.sort(function (a, b) { return b.score - a.score; });
      matches = matches.slice(0, 20);
      noResult.style.display = matches.length ? 'none' : 'block';

      matches.forEach(function (item) {
        var post = item.post;
        var li = document.createElement('li');
        var meta = post.date;
        if (post.tags.length) meta += ' · ' + post.tags.join(', ');

        li.innerHTML =
          '<a class="search-result-title" href="' + escapeHtml(post.url) + '">' +
            highlight(post.title, terms) +
          '</a>' +
          '<div class="search-result-meta">' + escapeHtml(meta) + '</div>' +
          '<p class="search-result">' + highlight(excerpt(post.text, terms), terms) + '</p>';
        resultList.appendChild(li);
      });
    };

    fetch(searchUrl)
      .then(function (response) { return response.json(); })
      .then(function (data) {
        posts = data || [];
        render();
      })
      .catch(function () {
        noResult.textContent = '搜索索引加载失败.';
        noResult.style.display = 'block';
      });

    searchInput.addEventListener('input', render);
  }
})();
