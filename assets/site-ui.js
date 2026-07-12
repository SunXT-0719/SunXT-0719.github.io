(function () {
  'use strict';

  function init() {
    var progress = document.getElementById('readingProgressBar');
    var topBar = document.querySelector('.top-bar');

    initVisitCounter();

    function updateScrollState() {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      if (progress) progress.style.transform = 'scaleX(' + ratio + ')';
      if (topBar) topBar.classList.toggle('is-scrolled', window.scrollY > 24);
    }

    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState, { passive: true });
    updateScrollState();

    document.addEventListener('click', function (event) {
      var scrollTrigger = event.target.closest('[data-scroll-to]');
      if (scrollTrigger) {
        var target = document.getElementById(scrollTrigger.getAttribute('data-scroll-to'));
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }

      var tabTrigger = event.target.closest('[data-open-tab]');
      if (tabTrigger) {
        var tab = document.getElementById('tab-btn-' + tabTrigger.getAttribute('data-open-tab'));
        if (tab) tab.click();
        var catFilter = tabTrigger.getAttribute('data-cat-filter');
        if (catFilter) {
          setTimeout(function () {
            var catBtns = document.querySelectorAll('.blog-cat-btn');
            catBtns.forEach(function (btn) {
              if (btn.getAttribute('data-cat') === catFilter) btn.click();
            });
          }, 300);
        }
      }
    });
  }

  function initVisitCounter() {
    var counter = document.getElementById('footerCounter');
    var uv = document.getElementById('busuanzi_site_uv');
    var pv = document.getElementById('busuanzi_site_pv');
    if (!counter || !uv || !pv) return;

    function isCount(value) {
      return /^\d[\d,]*$/.test(value);
    }

    function syncCounterState() {
      [uv, pv].forEach(function (element) {
        var value = element.textContent.trim();
        if (value !== '—' && !isCount(value)) {
          element.textContent = '—';
        }
      });

      var loaded = isCount(uv.textContent.trim()) && isCount(pv.textContent.trim());
      counter.classList.toggle('is-loaded', loaded);
      counter.title = loaded ? '全站独立访客与页面访问次数' : '访问计数服务暂不可用';
    }

    var observer = new MutationObserver(syncCounterState);
    observer.observe(uv, { childList: true, characterData: true, subtree: true });
    observer.observe(pv, { childList: true, characterData: true, subtree: true });
    syncCounterState();
  }

  document.addEventListener('site:sections-ready', init, { once: true });
}());
