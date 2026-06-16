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
    initBgGradient();
    loadSections().then(function () {
      initMusicPlayer();
      initMessages();
      initBlogFilter();
      initScrollReveal();
      initLightbox();
    });
  }

  /* ---- Gradient background: bgA → bgB over 1 screen scroll ---- */
  function initBgGradient() {
    var layerB = document.getElementById('bg-layer-b');
    if (!layerB) return;
    var vh = window.innerHeight;
    window.addEventListener('scroll', function () {
      layerB.style.opacity = Math.min(1, window.scrollY / vh);
    }, { passive: true });
  }

  function loadSections() {
    var sections = [
      { id: 'tab-about', file: 'sections/about.html' },
      { id: 'tab-blog', file: 'sections/blog.html' },
      { id: 'tab-messages', file: 'sections/messages.html' },
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
        toggle.textContent = '☀️';
      } else {
        html.removeAttribute('data-theme');
        toggle.textContent = '🌙';
      }
    }

    var stored = localStorage.getItem(STORAGE_KEY);
    var theme = stored || getSystemTheme();
    applyTheme(theme);

    toggle.addEventListener('click', function () {
      var current = html.hasAttribute('data-theme') ? 'dark' : 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
    });

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

      tabButtons.forEach(function (btn) {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      button.setAttribute('tabindex', '0');
      button.focus();

      tabPanels.forEach(function (panel) {
        panel.classList.remove('active');
      });
      var panel = getPanel(tabId);
      if (panel) {
        panel.classList.add('active');
      }

      if (window.location.hash !== '#' + tabId) {
        history.replaceState(null, '', '#' + tabId);
      }
    }

    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activateTab(btn);
      });
    });

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

    var hash = window.location.hash.replace('#', '');
    if (hash) {
      var targetBtn = document.getElementById('tab-btn-' + hash);
      if (targetBtn) {
        activateTab(targetBtn);
      }
    }
  }

  /* ===================================================
     3. Blog Filter & Search
     =================================================== */
  function initBlogFilter() {
    var catBtns = document.querySelectorAll('.blog-cat-btn');
    var searchInput = document.querySelector('.blog-search');
    var items = document.querySelectorAll('.blog-item');
    var emptyState = document.querySelector('.blog-empty');

    if (!catBtns.length || !items.length) return;

    var currentCat = '全部';
    var currentQuery = '';

    function applyFilters() {
      var visibleCount = 0;
      items.forEach(function (item) {
        var cat = item.getAttribute('data-category') || '';
        var keywords = (item.getAttribute('data-keywords') || '').toLowerCase();
        var text = (item.textContent || '').toLowerCase();

        var catMatch = currentCat === '全部' || cat === currentCat;
        var searchMatch = !currentQuery || keywords.indexOf(currentQuery) !== -1 || text.indexOf(currentQuery) !== -1;

        if (catMatch && searchMatch) {
          item.style.display = '';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? '' : 'none';
      }
    }

    catBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        catBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentCat = btn.getAttribute('data-cat') || '全部';
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        currentQuery = searchInput.value.toLowerCase().trim();
        applyFilters();
      });
    }

    /* ---- Dynamic blog loading: open posts in-page so music keeps playing ---- */
    var blogTab = document.getElementById('tab-blog');
    var blogListSaved = null;

    function showBlogList() {
      if (!blogTab || !blogListSaved) return;
      blogTab.innerHTML = blogListSaved;
      blogListSaved = null;
      // Re-init filters on the restored list
      var catBtns2 = blogTab.querySelectorAll('.blog-cat-btn');
      var searchInput2 = blogTab.querySelector('.blog-search');
      var items2 = blogTab.querySelectorAll('.blog-item');
      var emptyState2 = blogTab.querySelector('.blog-empty');
      if (catBtns2.length && items2.length) {
        var currentCat2 = '全部', currentQuery2 = '';
        function applyFilters2() {
          var vc = 0;
          items2.forEach(function (item) {
            var cat = item.getAttribute('data-category') || '';
            var kw = (item.getAttribute('data-keywords') || '').toLowerCase();
            var txt = (item.textContent || '').toLowerCase();
            var cm = currentCat2 === '全部' || cat === currentCat2;
            var sm = !currentQuery2 || kw.indexOf(currentQuery2) !== -1 || txt.indexOf(currentQuery2) !== -1;
            item.style.display = (cm && sm) ? '' : 'none';
            if (cm && sm) vc++;
          });
          if (emptyState2) emptyState2.style.display = vc === 0 ? '' : 'none';
        }
        catBtns2.forEach(function (btn) {
          btn.addEventListener('click', function () {
            catBtns2.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentCat2 = btn.getAttribute('data-cat') || '全部';
            applyFilters2();
          });
        });
        if (searchInput2) {
          searchInput2.addEventListener('input', function () {
            currentQuery2 = searchInput2.value.toLowerCase().trim();
            applyFilters2();
          });
        }
      }
      history.replaceState(null, '', '#blog');
    }

    // Event delegation — single handler on blog tab, survives DOM rebuilds
    if (blogTab) {
      blogTab.addEventListener('click', function (e) {
        var item = e.target.closest('.blog-item');
        if (!item) return;
        e.preventDefault();
        var href = item.getAttribute('href');
        if (!href) return;

        if (!blogListSaved) blogListSaved = blogTab.innerHTML;

        blogTab.innerHTML = '<div class="blog-detail"><p style="text-align:center;color:var(--text-secondary);padding:40px">加载中…</p></div>';

        fetch(href)
          .then(function (r) { return r.text(); })
          .then(function (html) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var article = doc.querySelector('.blog-detail');
            if (!article) { window.location.href = href; return; }

            var title = doc.querySelector('title');
            if (title) document.title = title.textContent;

            blogTab.innerHTML = '<a class="back-link blog-spa-back" href="#">← 返回 Blog</a>' + article.outerHTML;

            history.pushState(null, '', '#' + href.replace(/^blog\//, '').replace('.html', ''));

            var spaBack = blogTab.querySelector('.blog-spa-back');
            if (spaBack) {
              spaBack.addEventListener('click', function (e2) {
                e2.preventDefault();
                showBlogList();
                document.title = "SunXT's Homepage";
              });
            }
          })
          .catch(function () { window.location.href = href; });
      });
    }

    window.addEventListener('popstate', function () {
      if (window.location.hash === '#blog' && blogListSaved) {
        showBlogList();
        document.title = "SunXT's Homepage";
      }
    });
  }

  /* ===================================================
     4. Scroll Reveal
     =================================================== */
  function initScrollReveal() {
    var revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealElements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var OFFSET = 80;

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

    window.addEventListener('resize', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          checkVisibility();
          ticking = false;
        });
        ticking = true;
      }
    });

    checkVisibility();
  }

  /* ===================================================
     5. Music Player — Custom UI + APlayer API
     =================================================== */
  function initMusicPlayer() {
    var options = document.querySelectorAll('.pl-option');
    var dropdownList = document.getElementById('plDropdownList');
    var statusEl = document.getElementById('playerStatus');
    if (!options.length) return;

    var currentPl = 'favorite';
    var TIMEOUT = 15000;
    var POLL_INTERVAL = 250;
    var readySlots = {};
    var dropdownOpen = false;
    var activePlayer = null;
    var isDraggingProgress = false;
    var isDraggingVolume = false;

    // Track mode ourselves — APlayer.mode is a method, not a plain property

    /* ---- DOM refs ---- */
    var ui = document.getElementById('playerCustomUI');
    var coverEl = document.getElementById('playerCover');
    var nameEl = document.getElementById('playerSongName');
    var artistEl = document.getElementById('playerSongArtist');
    var statusIcon = document.getElementById('playerStatusIcon');
    var timeEl = document.getElementById('playerTime');
    var volIcon = document.getElementById('playerVolumeIcon');
    var volBar = document.getElementById('playerVolumeBar');
    var volWrap = document.getElementById('playerVolumeBarWrap');
    var progWrap = document.getElementById('playerProgressWrap');
    var progBar = document.getElementById('playerProgressBar');
    var btnPrev = document.getElementById('btnPrev');
    var btnPlay = document.getElementById('btnPlay');
    var btnNext = document.getElementById('btnNext');
    var btnList = document.getElementById('btnList');
    var listPanel = document.getElementById('playerListPanel');
    var listOl = document.getElementById('playerListOl');
    var plToggleBtn = document.getElementById('plToggleBtn');

    // SVG icon pieces
    var svgPlaying = statusIcon ? statusIcon.querySelector('.pl-icon-playing') : null;
    var svgPaused  = statusIcon ? statusIcon.querySelector('.pl-icon-paused') : null;
    var svgVolHigh  = volIcon ? volIcon.querySelector('.pl-vol-high') : null;
    var svgVolLow   = volIcon ? volIcon.querySelector('.pl-vol-low') : null;
    var svgVolMuted = volIcon ? volIcon.querySelector('.pl-vol-muted') : null;
    var svgPlayIcon  = btnPlay ? btnPlay.querySelector('.pl-play-icon') : null;
    var svgPauseIcon = btnPlay ? btnPlay.querySelector('.pl-pause-icon') : null;

    var loadingEl = statusEl ? statusEl.querySelector('.player-status-loading') : null;
    var errorEl   = statusEl ? statusEl.querySelector('.player-status-error') : null;
    var retryBtn  = statusEl ? statusEl.querySelector('.player-retry-btn') : null;

    function showSvg(el) { if (el) el.style.display = ''; }
    function hideSvg(el) { if (el) el.style.display = 'none'; }

    function showLoading() {
      if (loadingEl) loadingEl.style.display = '';
      if (errorEl) errorEl.style.display = 'none';
    }

    function showError() {
      if (loadingEl) loadingEl.style.display = 'none';
      if (errorEl) errorEl.style.display = '';
    }

    function hideStatus() {
      if (loadingEl) loadingEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'none';
    }

    function fmtTime(sec) {
      if (isNaN(sec) || sec < 0) return '00:00';
      var m = Math.floor(sec / 60);
      var s = Math.floor(sec % 60);
      return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
    }

    /* ---- Update playlist highlight without full re-render ---- */
    function updatePlaylistHighlight() {
      if (!listOl || listPanel.style.display === 'none') return;
      if (!activePlayer) return;
      var curIdx = activePlayer.list.index;
      var items = listOl.querySelectorAll('li');
      items.forEach(function (li, i) {
        if (i === curIdx) {
          li.classList.add('cur');
        } else {
          li.classList.remove('cur');
        }
      });
      // Scroll current into view
      var curLi = listOl.querySelector('li.cur');
      if (curLi) {
        curLi.scrollIntoView({ block: 'nearest' });
      }
    }

    /* ---- Sync entire custom UI from active APlayer state ---- */
    function syncUI() {
      if (!activePlayer) return;

      var audio = activePlayer.audio;
      var cur = activePlayer.list.audios[activePlayer.list.index];
      var duration = audio.duration || 0;
      var current = audio.currentTime || 0;
      var isPlaying = !audio.paused;
      var vol = audio.volume;
      var muted = audio.muted;

      // Cover
      if (cur && cur.cover) {
        coverEl.src = cur.cover;
      } else {
        coverEl.src = '';
      }

      // Song name & artist
      if (cur) {
        nameEl.textContent = cur.title || '未知歌曲';
        artistEl.textContent = cur.author || cur.artist || '--';
      }

      // Status icon
      if (isPlaying) {
        hideSvg(svgPaused);
        showSvg(svgPlaying);
        statusIcon.classList.add('playing');
      } else {
        hideSvg(svgPlaying);
        showSvg(svgPaused);
        statusIcon.classList.remove('playing');
      }

      // Time
      timeEl.textContent = fmtTime(current) + ' / ' + fmtTime(duration);

      // Progress bar
      var pct = duration > 0 ? (current / duration * 100) : 0;
      progBar.style.setProperty('--prog-pct', pct + '%');

      // Volume bar
      var volPct = muted ? 0 : (vol * 100);
      volBar.style.setProperty('--vol-pct', volPct + '%');

      // Volume icon
      hideSvg(svgVolHigh);
      hideSvg(svgVolLow);
      hideSvg(svgVolMuted);
      if (muted || vol === 0) {
        showSvg(svgVolMuted);
      } else if (vol < 0.5) {
        showSvg(svgVolLow);
      } else {
        showSvg(svgVolHigh);
      }

      // Play/pause button
      if (isPlaying) {
        hideSvg(svgPlayIcon);
        showSvg(svgPauseIcon);
        btnPlay.title = '暂停';
      } else {
        hideSvg(svgPauseIcon);
        showSvg(svgPlayIcon);
        btnPlay.title = '播放';
      }

      // Keep playlist highlight in sync
      updatePlaylistHighlight();
    }

    /* ---- Bind events from active player to custom UI ---- */
    function bindPlayerEvents() {
      if (!activePlayer) return;
      var audio = activePlayer.audio;

      audio.addEventListener('play', syncUI);
      audio.addEventListener('pause', syncUI);
      audio.addEventListener('ended', syncUI);
      audio.addEventListener('timeupdate', function () {
        if (!isDraggingProgress) syncUI();
      });
      audio.addEventListener('loadedmetadata', syncUI);
      audio.addEventListener('volumechange', syncUI);
      audio.addEventListener('error', function () { syncUI(); });

      // APlayer list switch event — rebuild playlist content
      if (activePlayer.on) {
        activePlayer.on('listswitch', function () {
          syncUI();
          if (listPanel.style.display !== 'none') {
            renderPlaylist();
          }
        });
      }
    }

    /* ---- Progress bar: click & drag ---- */
    function seekFromEvent(e) {
      if (!activePlayer || !activePlayer.audio.duration) return;
      var rect = progBar.getBoundingClientRect();
      var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      activePlayer.seek(pct * activePlayer.audio.duration);
    }

    progWrap.addEventListener('mousedown', function (e) {
      if (!activePlayer) return;
      isDraggingProgress = true;
      seekFromEvent(e);
      syncUI();

      function onMove(ev) {
        if (isDraggingProgress) { seekFromEvent(ev); syncUI(); }
      }
      function onUp() {
        isDraggingProgress = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    /* ---- Volume bar: click & drag ---- */
    function setVolumeFromEvent(e) {
      if (!activePlayer) return;
      var rect = volBar.getBoundingClientRect();
      var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      activePlayer.audio.volume = pct;
      activePlayer.audio.muted = false;
      syncUI();
    }

    volWrap.addEventListener('mousedown', function (e) {
      if (!activePlayer) return;
      isDraggingVolume = true;
      setVolumeFromEvent(e);

      function onMove(ev) {
        if (isDraggingVolume) setVolumeFromEvent(ev);
      }
      function onUp() {
        isDraggingVolume = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    /* ---- Volume icon: toggle mute ---- */
    volIcon.addEventListener('click', function () {
      if (!activePlayer) return;
      activePlayer.audio.muted = !activePlayer.audio.muted;
      syncUI();
    });

    /* ---- Control buttons ---- */
    btnPlay.addEventListener('click', function () {
      if (!activePlayer) return;
      activePlayer.toggle();
    });

    btnPrev.addEventListener('click', function () {
      if (!activePlayer) return;
      activePlayer.skipBack();
      // Defer highlight update so APlayer has time to update list.index
      setTimeout(function () {
        syncUI();
        if (listPanel.style.display !== 'none') {
          renderPlaylist();
        }
      }, 50);
    });

    btnNext.addEventListener('click', function () {
      if (!activePlayer) return;
      activePlayer.skipForward();
      setTimeout(function () {
        syncUI();
        if (listPanel.style.display !== 'none') {
          renderPlaylist();
        }
      }, 50);
    });

    /* ---- Playlist panel ---- */
    function renderPlaylist() {
      if (!activePlayer) return;
      var list = activePlayer.list;
      var curIdx = list.index;
      var frag = document.createDocumentFragment();
      list.audios.forEach(function (audio, i) {
        var li = document.createElement('li');
        if (i === curIdx) li.classList.add('cur');
        li.innerHTML = '<span class="player-list-index">' + (i + 1) + '</span>' +
          '<span class="player-list-title">' + (audio.title || '未知歌曲') + '</span>' +
          '<span class="player-list-author">' + (audio.author || audio.artist || '') + '</span>';
        li.addEventListener('click', function () {
          activePlayer.list.switch(i);
          activePlayer.play();
          renderPlaylist();
        });
        frag.appendChild(li);
      });
      listOl.innerHTML = '';
      listOl.appendChild(frag);

      var curLi = listOl.querySelector('li.cur');
      if (curLi) {
        curLi.scrollIntoView({ block: 'nearest' });
      }
    }

    btnList.addEventListener('click', function () {
      if (listPanel.style.display === 'none') {
        renderPlaylist();
        listPanel.style.display = '';
      } else {
        listPanel.style.display = 'none';
      }
    });

    /* ---- In-place playlist dropdown ---- */
    function openDropdown() {
      dropdownOpen = true;
      dropdownList.style.display = '';
    }

    function closeDropdown() {
      dropdownOpen = false;
      dropdownList.style.display = 'none';
    }

    if (plToggleBtn) {
      plToggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (dropdownOpen) { closeDropdown(); }
        else              { openDropdown(); }
      });
    }

    document.addEventListener('click', function (e) {
      if (dropdownOpen && plToggleBtn && !plToggleBtn.contains(e.target) && !dropdownList.contains(e.target)) {
        closeDropdown();
      }
    });

    /* ---- Wait for MetingJS to create APlayer ---- */
    function waitForPlayer(key, timeout) {
      return new Promise(function (resolve, reject) {
        var slot = document.getElementById('pl-' + key);
        if (!slot) return reject(new Error('Slot not found: ' + key));

        var meting = slot.querySelector('meting-js');
        if (meting && meting.aplayer) {
          readySlots[key] = true;
          return resolve(key);
        }

        var started = Date.now();
        var timer = setInterval(function () {
          var m = slot.querySelector('meting-js');
          if (m && m.aplayer) {
            clearInterval(timer);
            readySlots[key] = true;
            return resolve(key);
          }
          if (Date.now() - started > timeout) {
            clearInterval(timer);
            return reject(new Error('Timeout: ' + key));
          }
        }, POLL_INTERVAL);
      });
    }

    function getPlayer(key) {
      var slot = document.getElementById('pl-' + key);
      if (!slot) return null;
      var meting = slot.querySelector('meting-js');
      return meting && meting.aplayer ? meting.aplayer : null;
    }

    /* ---- Switch playlist ---- */
    function switchToPlaylist(key) {
      if (key === currentPl) return;

      if (activePlayer) {
        activePlayer.pause();
      }

      currentPl = key;
      activePlayer = getPlayer(key);
      if (activePlayer) {
        bindPlayerEvents();
        syncUI();
        if (ui) ui.style.display = '';
        hideStatus();
        if (listPanel.style.display !== 'none') {
          renderPlaylist();
        }
      }
    }

    function updateActiveOption(key) {
      options.forEach(function (o) {
        o.classList.remove('active');
        if (o.getAttribute('data-pl') === key) o.classList.add('active');
      });
    }

    /* ---- Init ---- */
    showLoading();

    var favReady = waitForPlayer('favorite', TIMEOUT);
    var subReady = waitForPlayer('subahibi', TIMEOUT);

    Promise.race([favReady, subReady]).then(function (key) {
      activePlayer = getPlayer(key);
      if (activePlayer) {
        bindPlayerEvents();
        syncUI();
        if (ui) ui.style.display = '';
        hideStatus();
      }
      updateActiveOption(key);
      currentPl = key;
    }).catch(function (err) {
      showError();
      console.error('Music player init failed:', err);
    });

    favReady.then(function () { hideStatus(); })
      .catch(function (e) { console.warn('Favorite playlist failed to load:', e); });
    subReady.then(function () { hideStatus(); })
      .catch(function (e) { console.warn('Subahibi playlist failed to load:', e); });

    /* ---- Playlist switch via dropdown ---- */
    options.forEach(function (opt) {
      opt.addEventListener('click', function (e) {
        e.stopPropagation();
        var key = opt.getAttribute('data-pl');
        if (key === currentPl) { closeDropdown(); return; }

        updateActiveOption(key);
        closeDropdown();

        if (readySlots[key]) {
          switchToPlaylist(key);
          return;
        }

        showLoading();
        waitForPlayer(key, TIMEOUT).then(function () {
          switchToPlaylist(key);
          hideStatus();
        }).catch(function () {
          showError();
        });
      });
    });

    /* ---- Retry ---- */
    if (retryBtn) {
      retryBtn.addEventListener('click', function () {
        location.reload();
      });
    }
  }

  /* ===================================================
     6. Lightbox
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

  /* ===================================================
     7. Messages / Guestbook
     =================================================== */
  function initMessages() {
    // Config — set these before deploying
    var API_BASE = 'https://api.github.com';
    var REPO_OWNER = 'SunXT-0719';
    var REPO_NAME = 'SunXT-0719.github.io';
    var ISSUE_NUMBER = 2;
    // The Vercel-deployed OAuth function URL
    var OAUTH_URL = 'https://githubio-eight.vercel.app/api/oauth';

    var token = localStorage.getItem('gh_token');

    var msgLogin = document.getElementById('msgLogin');
    var msgLoginBtn = document.getElementById('msgLoginBtn');
    var msgUser = document.getElementById('msgUser');
    var msgAvatar = document.getElementById('msgAvatar');
    var msgUsername = document.getElementById('msgUsername');
    var msgLogoutBtn = document.getElementById('msgLogoutBtn');
    var msgInputArea = document.getElementById('msgInputArea');
    var msgTextarea = document.getElementById('msgTextarea');
    var msgPreview = document.getElementById('msgPreview');
    var msgSubmitBtn = document.getElementById('msgSubmitBtn');
    var msgSubmitHint = document.getElementById('msgSubmitHint');
    var msgList = document.getElementById('msgList');

    if (!msgLogin) return; // messages tab not loaded

    /* ---- Auth ---- */
    function showLoggedIn(user) {
      msgLogin.style.display = 'none';
      msgUser.style.display = 'flex';
      msgInputArea.style.display = '';
      msgAvatar.src = user.avatar_url;
      msgUsername.textContent = user.login;
    }

    function showLoggedOut() {
      msgLogin.style.display = '';
      msgUser.style.display = 'none';
      msgInputArea.style.display = 'none';
      localStorage.removeItem('gh_token');
      token = null;
    }

    function fetchUser() {
      if (!token) return;
      fetch(API_BASE + '/user', {
        headers: { 'Authorization': 'token ' + token }
      })
      .then(function (r) {
        if (!r.ok) return r.json().then(function (e) { throw new Error('API error ' + r.status + ': ' + (e.message || '')); });
        return r.json();
      })
      .then(function (user) { showLoggedIn(user); })
      .catch(function (err) {
        console.error('GitHub user fetch failed:', err);
        showLoggedOut();
      });
    }

    msgLoginBtn.addEventListener('click', function () {
      if (OAUTH_URL.indexOf('YOUR-VERCEL') === 0) {
        alert('请先将留言板的 OAUTH_URL 和 ISSUE_NUMBER 配置正确。\n详见 assets/script.js 中 initMessages 函数顶部的注释。');
        return;
      }
      window.location.href = OAUTH_URL;
    });

    // Handle OAuth callback — token is in URL query param after Vercel redirect
    var params = new URLSearchParams(window.location.search);
    var urlToken = params.get('gh_token');
    console.log('[留言板] URL search:', window.location.search, 'token found:', !!urlToken);
    if (urlToken) {
      token = urlToken;
      console.log('[留言板] Saving token:', token.substring(0, 12) + '...');
      localStorage.setItem('gh_token', token);
      history.replaceState(null, '', window.location.pathname);
      fetchUser();
    } else {
      // Check localStorage for existing token
      var savedToken = localStorage.getItem('gh_token');
      console.log('[留言板] No URL token, localStorage token:', !!savedToken);
      if (savedToken) {
        token = savedToken;
        fetchUser();
      }
    }

    msgLogoutBtn.addEventListener('click', function () {
      showLoggedOut();
    });

    /* ---- Markdown preview ---- */
    var previewMode = 'write';
    document.querySelectorAll('.msg-tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.msg-tab-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        previewMode = btn.getAttribute('data-mode');
        if (previewMode === 'preview') {
          msgTextarea.style.display = 'none';
          msgPreview.style.display = '';
          if (typeof marked !== 'undefined') {
            msgPreview.innerHTML = marked.parse(msgTextarea.value || '*暂无内容*');
          }
        } else {
          msgTextarea.style.display = '';
          msgPreview.style.display = 'none';
        }
      });
    });

    // Live preview update on input
    msgTextarea.addEventListener('input', function () {
      var val = msgTextarea.value.trim();
      msgSubmitBtn.disabled = !val;
      if (previewMode === 'preview' && typeof marked !== 'undefined') {
        msgPreview.innerHTML = marked.parse(msgTextarea.value || '*暂无内容*');
      }
    });

    /* ---- Submit message ---- */
    msgSubmitBtn.addEventListener('click', function () {
      if (!token || !msgTextarea.value.trim()) return;
      msgSubmitBtn.disabled = true;
      msgSubmitBtn.textContent = '发送中…';

      fetch(API_BASE + '/repos/' + REPO_OWNER + '/' + REPO_NAME + '/issues/' + ISSUE_NUMBER + '/comments', {
        method: 'POST',
        headers: {
          'Authorization': 'token ' + token,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({ body: msgTextarea.value })
      })
      .then(function (r) {
        if (!r.ok) return r.json().then(function (e) { throw new Error(e.message); });
        return r.json();
      })
      .then(function () {
        msgTextarea.value = '';
        msgSubmitBtn.textContent = '发送留言';
        msgSubmitBtn.disabled = true;
        msgSubmitHint.textContent = '✅ 发送成功！';
        loadMessages();
      })
      .catch(function (err) {
        msgSubmitBtn.disabled = false;
        msgSubmitBtn.textContent = '发送留言';
        msgSubmitHint.textContent = '❌ ' + (err.message || '发送失败');
      });
    });

    /* ---- Load & render messages ---- */
    function loadMessages() {
      msgList.innerHTML = '<p class="msg-loading">加载留言中…</p>';
      fetch(API_BASE + '/repos/' + REPO_OWNER + '/' + REPO_NAME + '/issues/' + ISSUE_NUMBER + '/comments?' +
        'per_page=50&' + new Date().getTime())
      .then(function (r) { return r.json(); })
      .then(function (comments) {
        if (!Array.isArray(comments)) {
          msgList.innerHTML = '<p class="msg-empty">暂无留言，来做第一个留言的人吧 ✨</p>';
          return;
        }
        if (comments.length === 0) {
          msgList.innerHTML = '<p class="msg-empty">暂无留言，来做第一个留言的人吧 ✨</p>';
          return;
        }
        var html = '';
        comments.reverse().forEach(function (c) {
          var body = c.body || '';
          if (typeof marked !== 'undefined') {
            body = marked.parse(body);
          } else {
            body = body.replace(/</g, '&lt;').replace(/>/g, '&gt;');
          }
          html += '<div class="msg-item">' +
            '<img class="msg-item-avatar" src="' + (c.user ? c.user.avatar_url : '') + '" alt="">' +
            '<div class="msg-item-body">' +
              '<div class="msg-item-header">' +
                '<span class="msg-item-name">' + (c.user ? c.user.login : 'anonymous') + '</span>' +
                '<span class="msg-item-time">' + new Date(c.created_at).toLocaleString('zh-CN') + '</span>' +
              '</div>' +
              '<div class="msg-item-content markdown-body">' + body + '</div>' +
            '</div>' +
          '</div>';
        });
        msgList.innerHTML = html;
      })
      .catch(function () {
        msgList.innerHTML = '<p class="msg-empty">加载失败，请检查留言板配置 (ISSUE_NUMBER)</p>';
      });
    }

    // Init
    if (token) { fetchUser(); }
    loadMessages();
  }

})();
