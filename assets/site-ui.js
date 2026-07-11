(function () {
  'use strict';

  function init() {
    var progress = document.getElementById('readingProgressBar');
    var topBar = document.querySelector('.top-bar');

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

  document.addEventListener('site:sections-ready', init, { once: true });
}());
