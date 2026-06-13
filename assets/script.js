(function () {
  'use strict';

  /* ===================================================
     Initialization
     =================================================== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initTheme();
    initTabs();
    loadSections().then(function () {
      initScrollReveal();
      initLightbox();
    });
  }

  function loadSections() {
    var sections = [
      { id: 'tab-about', file: 'sections/about.html' },
      { id: 'tab-blog', file: 'sections/blog.html' }
    ];
    return Promise.all(sections.map(function (s) {
      return fetch(s.file)
        .then(function (r) { return r.text(); })
        .then(function (html) {
          var panel = document.getElementById(s.id);
          if (panel) panel.innerHTML = html;
        })
        .catch(function () {
          // Section file not found — leave panel empty
        });
    }));
  }

  /* ===================================================
     1. Theme System
     =================================================== */
  function initTheme() {
    var STORAGE_KEY = 'theme-preference';
    var toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    var html = document.documentElement;

    function getSystemTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    function applyTheme(theme) {
      if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        toggle.textContent = '☀️'; // ☀️
      } else {
        html.removeAttribute('data-theme');
        toggle.textContent = '🌙'; // 🌙
      }
    }

    // Read preference: localStorage -> system preference -> light
    var stored = localStorage.getItem(STORAGE_KEY);
    var theme = stored || getSystemTheme();
    applyTheme(theme);

    // Toggle button click
    toggle.addEventListener('click', function () {
      var current = html.hasAttribute('data-theme') ? 'dark' : 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
    });

    // Listen for system theme changes only when user hasn't set a manual preference
    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', function (e) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  /* ===================================================
     2. Tab Switching with Keyboard Navigation
     =================================================== */
  function initTabs() {
    var tabButtons = document.querySelectorAll('.tab-btn');
    var tabPanels = document.querySelectorAll('.tab-content');
    var tabList = document.querySelector('.tab-nav');

    function getTabId(button) {
      return button.getAttribute('data-tab');
    }

    function getPanel(tabId) {
      return document.getElementById('tab-' + tabId);
    }

    function activateTab(button) {
      var tabId = getTabId(button);

      // Update tab buttons
      tabButtons.forEach(function (btn) {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      button.setAttribute('tabindex', '0');
      button.focus();

      // Update tab panels
      tabPanels.forEach(function (panel) {
        panel.classList.remove('active');
      });
      var panel = getPanel(tabId);
      if (panel) {
        panel.classList.add('active');
      }

      // Update URL hash without causing a scroll jump
      if (window.location.hash !== '#' + tabId) {
        history.replaceState(null, '', '#' + tabId);
      }
    }

    // --- Click handling ---
    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activateTab(btn);
      });
    });

    // --- Keyboard navigation (roving tabindex) ---
    if (tabList) {
      tabList.addEventListener('keydown', function (e) {
        var current = document.activeElement;
        if (!current || !current.classList.contains('tab-btn')) return;

        var idx = Array.prototype.indexOf.call(tabButtons, current);
        if (idx === -1) return;

        var target = null;
        var lastIdx = tabButtons.length - 1;

        switch (e.key) {
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            target = tabButtons[idx === 0 ? lastIdx : idx - 1];
            break;

          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            target = tabButtons[idx === lastIdx ? 0 : idx + 1];
            break;

          case 'Home':
            e.preventDefault();
            target = tabButtons[0];
            break;

          case 'End':
            e.preventDefault();
            target = tabButtons[lastIdx];
            break;
        }

        if (target && target !== current) {
          activateTab(target);
        }
      });
    }

    // --- Load tab from URL hash on page load ---
    var hash = window.location.hash.replace('#', '');
    if (hash) {
      var targetBtn = document.getElementById('tab-btn-' + hash);
      if (targetBtn) {
        activateTab(targetBtn);
      }
    }
    // If no hash (or hash doesn't match a tab), the first tab ("about")
    // remains active as set in the HTML.
  }

  /* ===================================================
     3. Scroll Reveal (throttled with requestAnimationFrame)
     =================================================== */
  function initScrollReveal() {
    var revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    // Respect user's reduced motion preference (WCAG 2.2)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealElements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var OFFSET = 80; // pixels from bottom of viewport to trigger early

    function checkVisibility() {
      var windowHeight = window.innerHeight;

      revealElements.forEach(function (el) {
        if (el.classList.contains('visible')) return;

        var rect = el.getBoundingClientRect();
        if (rect.top < windowHeight - OFFSET) {
          el.classList.add('visible');
        }
      });
    }

    // Throttle scroll with requestAnimationFrame
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          checkVisibility();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Also check on window resize
    window.addEventListener('resize', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          checkVisibility();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Reveal elements already in view on page load
    checkVisibility();
  }

  /* ===================================================
     4. Lightbox
     =================================================== */
  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var avatarLink = document.querySelector('.avatar-link');
    var avatarImg = document.querySelector('.avatar');

    if (!lightbox || !avatarLink || !avatarImg) return;

    avatarLink.addEventListener('click', function (e) {
      e.preventDefault();
      lightboxImg.src = avatarImg.src;
      lightbox.classList.add('open');
    });

    lightbox.addEventListener('click', function () {
      lightbox.classList.remove('open');
    });
  }
})();
