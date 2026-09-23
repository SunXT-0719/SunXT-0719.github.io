const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function createCard(rectRef) {
  const classes = new Set(['reveal']);
  return {
    offsetParent: {},
    classList: {
      add(name) { classes.add(name); },
      contains(name) { return classes.has(name); }
    },
    getBoundingClientRect() { return rectRef.current; }
  };
}

function loadRevealHarness(getCards) {
  let source = fs.readFileSync(path.join(root, 'assets/script.js'), 'utf8');
  source = source.replace(
    /\}\)\(\);\s*$/,
    'globalThis.__revealTest = { init: initScrollReveal, refresh: function () { requestRevealRefresh(); } };\n})();'
  );

  const context = {
    console,
    document: {
      readyState: 'loading',
      addEventListener() {},
      querySelectorAll(selector) { return selector === '.reveal' ? getCards() : []; }
    },
    window: {
      innerHeight: 800,
      addEventListener() {},
      matchMedia() { return { matches: false }; }
    },
    requestAnimationFrame(callback) { callback(); }
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  return context.__revealTest;
}

test('reveal refresh shows a card moved into view without a scroll event', () => {
  const rect = { current: { top: 900, bottom: 1000 } };
  const card = createCard(rect);
  const reveal = loadRevealHarness(() => [card]);

  reveal.init();
  assert.equal(card.classList.contains('visible'), false);

  rect.current = { top: 160, bottom: 260 };
  reveal.refresh();
  assert.equal(card.classList.contains('visible'), true);
});

test('reveal refresh dynamically discovers a restored Blog card', () => {
  let cards = [];
  const reveal = loadRevealHarness(() => cards);
  reveal.init();

  const rect = { current: { top: 120, bottom: 220 } };
  const restoredCard = createCard(rect);
  cards = [restoredCard];
  reveal.refresh();
  assert.equal(restoredCard.classList.contains('visible'), true);
});

test('music cache contains both complete playlist snapshots and direct fallbacks', () => {
  const playlists = JSON.parse(
    fs.readFileSync(path.join(root, 'assets/data/music-playlists.json'), 'utf8')
  );
  assert.equal(playlists.favorite.length, 100);
  assert.equal(playlists.subahibi.length, 47);

  for (const track of [...playlists.favorite, ...playlists.subahibi]) {
    assert.match(track.url, /^https:\/\/music\.yuncan\.xyz\/api\?/);
    assert.match(track.fallbackUrl, /^https:\/\/music\.163\.com\/song\/media\/outer\/url\?/);
  }
});

test('music dependencies are pinned and both Meting elements use the healthy API', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const matches = html.match(/api="https:\/\/music\.yuncan\.xyz\/api\?/g) || [];
  assert.equal(matches.length, 2);
  assert.match(html, /aplayer@1\.10\.1\/dist\/APlayer\.min\.css/);
  assert.match(html, /aplayer@1\.10\.1\/dist\/APlayer\.min\.js/);
  assert.match(html, /meting@2\.0\.2\/dist\/Meting\.min\.js/);
});
