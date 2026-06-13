# 个人主页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建极简玻璃拟态风格个人主页，支持明暗主题切换和标签页导航

**Architecture:** 纯静态 HTML + CSS + JS，单文件 index.html 包含双标签结构，style.css 使用 CSS 变量管理明暗主题，script.js 处理标签切换、主题切换和滚动动效

**Tech Stack:** HTML5, CSS3 (CSS Variables, backdrop-filter, Intersection Observer), Vanilla JS (ES6+)

---

### Task 1: 创建目录结构和基础文件

**Files:**
- Create: `assets/images/.gitkeep`
- Create: `blog/.gitkeep`

- [ ] **Step 1: 创建所需目录**

```bash
mkdir -p /Users/sunxt/github.io/assets/images /Users/sunxt/github.io/blog
touch /Users/sunxt/github.io/assets/images/.gitkeep
touch /Users/sunxt/github.io/blog/.gitkeep
```

- [ ] **Step 2: 确认 .gitignore 已创建**

```bash
cat /Users/sunxt/github.io/.gitignore
```
Expected: `.superpowers/` in output

- [ ] **Step 3: 提交**

```bash
git add -A && git commit -m "chore: create directory structure and .gitignore"
```

---

### Task 2: 创建全局样式 assets/style.css

**Files:**
- Create: `assets/style.css`

- [ ] **Step 1: 写入完整样式文件**

```css
/* === CSS Variables: Light & Dark Themes === */
:root {
  --bg-image: url('images/bg.svg');
  --card-bg: rgba(255, 255, 255, 0.6);
  --card-border: rgba(255, 255, 255, 0.8);
  --text-primary: #1a1a2e;
  --text-secondary: rgba(0, 0, 0, 0.5);
  --tab-active-bg: rgba(255, 255, 255, 0.7);
  --tab-inactive: rgba(0, 0, 0, 0.35);
  --shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  --hover-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  --divider: rgba(0, 0, 0, 0.08);
  --tag-bg: rgba(0, 0, 0, 0.05);
  --accent: #4a6cf7;
  --glass-blur: blur(20px) saturate(180%);
}

[data-theme="dark"] {
  --card-bg: rgba(255, 255, 255, 0.06);
  --card-border: rgba(255, 255, 255, 0.1);
  --text-primary: #e8e8f0;
  --text-secondary: rgba(255, 255, 255, 0.5);
  --tab-active-bg: rgba(255, 255, 255, 0.12);
  --tab-inactive: rgba(255, 255, 255, 0.4);
  --shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  --hover-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  --divider: rgba(255, 255, 255, 0.08);
  --tag-bg: rgba(255, 255, 255, 0.08);
  --accent: #6d8aff;
}

/* === Reset & Base === */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
               "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  color: var(--text-primary);
  background-image: var(--bg-image);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 100px 16px 48px;
  transition: color 0.35s ease;
}

/* === Background Overlay === */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background: inherit;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

/* === Top Bar === */
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  background: var(--card-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--card-border);
}

.site-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* === Theme Toggle === */
.theme-toggle {
  background: none;
  border: 1px solid var(--card-border);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.25s, transform 0.2s;
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  background: var(--card-bg);
}

.theme-toggle:hover {
  transform: scale(1.1);
}

/* === Main Container === */
.main-container {
  width: 100%;
  max-width: 640px;
}

/* === Tab Navigation === */
.tab-nav {
  display: flex;
  gap: 4px;
  margin-bottom: 24px;
  padding: 4px;
  background: var(--card-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--card-border);
  border-radius: 24px;
  width: fit-content;
}

.tab-btn {
  padding: 8px 22px;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--tab-inactive);
  background: transparent;
  transition: all 0.3s ease;
  font-family: inherit;
}

.tab-btn.active {
  background: var(--tab-active-bg);
  color: var(--text-primary);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* === Tab Content === */
.tab-content {
  display: none;
  animation: fadeSlideIn 0.4s ease;
}

.tab-content.active {
  display: block;
}

/* === Glass Card === */
.card {
  background: var(--card-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 20px;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--hover-shadow);
}

.card-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
  margin-bottom: 14px;
}

/* === Hero Section === */
.hero {
  text-align: center;
  padding: 32px 28px 28px;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--card-border);
  margin-bottom: 18px;
  box-shadow: var(--shadow);
}

.hero-name {
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}

.hero-tagline {
  font-size: 0.95rem;
  color: var(--text-secondary);
  font-weight: 400;
}

/* === About Section === */
.about-text {
  font-size: 0.95rem;
  line-height: 1.75;
  color: var(--text-primary);
}

.about-text p + p {
  margin-top: 1em;
}

/* === Project Cards === */
.project-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-item {
  padding: 20px 24px;
}

.project-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.project-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 8px;
}

.project-link {
  font-size: 0.8rem;
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.project-link:hover {
  opacity: 0.7;
}

/* === Blog List === */
.blog-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.blog-item {
  padding: 0;
  overflow: hidden;
  display: block;
  text-decoration: none;
  color: inherit;
}

.blog-item-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  background: var(--tag-bg);
}

.blog-item-body {
  padding: 20px 24px;
}

.blog-item-date {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.blog-item-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--text-primary);
}

.blog-item-excerpt {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* === Contact Links === */
.contact-links {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.9rem;
  padding: 8px 16px;
  border-radius: 10px;
  background: var(--tag-bg);
  transition: background 0.2s, transform 0.2s;
}

.contact-link:hover {
  background: var(--card-border);
  transform: translateY(-1px);
}

.contact-icon {
  font-size: 1.1rem;
}

/* === Footer === */
.footer {
  text-align: center;
  padding: 20px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* === Blog Detail Page === */
.blog-detail {
  padding-top: 16px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.85rem;
  margin-bottom: 20px;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--text-primary);
}

.blog-detail-cover {
  width: 100%;
  max-height: 320px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 20px;
}

.blog-detail-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.blog-detail-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.3;
}

.blog-detail-body {
  font-size: 0.95rem;
  line-height: 1.85;
  color: var(--text-primary);
}

.blog-detail-body p + p {
  margin-top: 1em;
}

.blog-detail-body h2 {
  font-size: 1.2rem;
  margin-top: 1.6em;
  margin-bottom: 0.6em;
}

.blog-detail-body ul,
.blog-detail-body ol {
  margin: 0.8em 0;
  padding-left: 1.5em;
}

.blog-detail-body li + li {
  margin-top: 0.3em;
}

.blog-detail-body code {
  background: var(--tag-bg);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.88em;
}

.blog-detail-body pre {
  background: var(--tag-bg);
  padding: 16px;
  border-radius: 10px;
  overflow-x: auto;
  margin: 1em 0;
}

.blog-detail-body pre code {
  background: none;
  padding: 0;
}

.blog-detail-body blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 16px;
  color: var(--text-secondary);
  margin: 1em 0;
}

/* === No Posts Placeholder === */
.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--text-secondary);
}

.empty-state-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.empty-state-text {
  font-size: 0.9rem;
}

/* === Scroll Animation === */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* === Animations === */
@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* === Responsive === */
@media (max-width: 480px) {
  body {
    padding: 88px 12px 32px;
  }

  .top-bar {
    padding: 12px 16px;
  }

  .card {
    padding: 20px;
  }

  .hero {
    padding: 24px 20px;
  }

  .avatar {
    width: 76px;
    height: 76px;
  }

  .hero-name {
    font-size: 1.35rem;
  }

  .blog-item-image {
    height: 140px;
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add assets/style.css && git commit -m "feat: add global styles with glassmorphism and dual theme"
```

---

### Task 3: 创建主页 index.html

**Files:**
- Create: `index.html`

- [ ] **Step 1: 写入完整 HTML 文件**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>个人主页</title>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <!-- Top Bar -->
  <header class="top-bar">
    <span class="site-name">SunXT</span>
    <div class="top-bar-right">
      <button class="theme-toggle" id="themeToggle" aria-label="切换主题">🌙</button>
    </div>
  </header>

  <!-- Main Content -->
  <main class="main-container">
    <!-- Tab Navigation -->
    <nav class="tab-nav" role="tablist">
      <button class="tab-btn active" role="tab" data-tab="about">个人简介</button>
      <button class="tab-btn" role="tab" data-tab="blog">Blog</button>
    </nav>

    <!-- ==================== About Tab ==================== -->
    <section class="tab-content active" id="tab-about" role="tabpanel">
      <!-- Hero -->
      <div class="card hero reveal">
        <img class="avatar" src="assets/images/avatar.svg" alt="头像">
        <h1 class="hero-name">你的名字</h1>
        <p class="hero-tagline">一句话介绍 · 你在这里</p>
      </div>

      <!-- About Me -->
      <div class="card reveal">
        <div class="card-title">关于我</div>
        <div class="about-text">
          <p>在这里写上你的自我介绍。可以是一段较长篇幅的文字，介绍你的背景、兴趣、在做的事情、或者任何你想和访客分享的内容。这个区域专门为充分表达而设计，希望能让人更好地了解你。</p>
          <p>可以分段写。谈谈你的经历、你的想法、你的热情所在。如果你在某个领域有所建树或者独特的见解，可以在这里展开聊聊。</p>
        </div>
      </div>

      <!-- Projects -->
      <div class="card reveal">
        <div class="card-title">项目</div>
        <div class="project-list">
          <div class="card project-item">
            <div class="project-name">项目名称</div>
            <div class="project-desc">项目的简短描述，说明它做了什么、解决了什么问题。</div>
            <a class="project-link" href="#" target="_blank" rel="noopener">查看项目 →</a>
          </div>
          <div class="card project-item">
            <div class="project-name">另一个项目</div>
            <div class="project-desc">同样简短的描述。建议放 2-4 个精选项目即可。</div>
            <a class="project-link" href="#" target="_blank" rel="noopener">查看项目 →</a>
          </div>
        </div>
      </div>

      <!-- Contact -->
      <div class="card reveal">
        <div class="card-title">联系方式</div>
        <div class="contact-links">
          <a class="contact-link" href="https://github.com/SunXT-0719" target="_blank" rel="noopener">
            <span class="contact-icon">⌘</span> GitHub
          </a>
          <a class="contact-link" href="mailto:your-email@example.com">
            <span class="contact-icon">✉</span> Email
          </a>
        </div>
      </div>

      <div class="footer">
        <p>&copy; 2026 SunXT</p>
      </div>
    </section>

    <!-- ==================== Blog Tab ==================== -->
    <section class="tab-content" id="tab-blog" role="tabpanel">
      <div class="blog-list">
        <!-- Blog 文章列表 — 在此手动添加/编辑 -->
        <a class="card blog-item reveal" href="blog/post-1.html">
          <img class="blog-item-image" src="assets/images/blog-placeholder.svg" alt="文章封面">
          <div class="blog-item-body">
            <div class="blog-item-date">2026-06-14</div>
            <div class="blog-item-title">示例文章标题</div>
            <div class="blog-item-excerpt">这是一篇示例文章的摘要，简要概括文章内容。点击进入阅读全文。</div>
          </div>
        </a>

        <!-- 没有文章时显示空状态（注释掉上方 <a> 标签，取消下方注释） -->
        <!--
        <div class="card empty-state reveal">
          <div class="empty-state-icon">📝</div>
          <div class="empty-state-text">还没有文章，敬请期待</div>
        </div>
        -->
      </div>

      <div class="footer">
        <p>&copy; 2026 SunXT</p>
      </div>
    </section>
  </main>

  <script src="assets/script.js"></script>
</body>
</html>
```

- [ ] **Step 2: 提交**

```bash
git add index.html && git commit -m "feat: create homepage with tab navigation and content sections"
```

---

### Task 4: 创建交互脚本 assets/script.js

**Files:**
- Create: `assets/script.js`

- [ ] **Step 1: 写入完整脚本文件**

```javascript
(function () {
  'use strict';

  /* ========== Theme ========== */
  var themeToggle = document.getElementById('themeToggle');
  var THEME_KEY = 'theme-preference';

  function getTheme() {
    var stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.textContent = '☀️';
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggle.textContent = '🌙';
    }
  }

  var currentTheme = getTheme();
  applyTheme(currentTheme);

  themeToggle.addEventListener('click', function () {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, currentTheme);
    applyTheme(currentTheme);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(THEME_KEY)) {
      currentTheme = e.matches ? 'dark' : 'light';
      applyTheme(currentTheme);
    }
  });

  /* ========== Tab Switching ========== */
  var tabButtons = document.querySelectorAll('.tab-btn');
  var tabContents = document.querySelectorAll('.tab-content');

  function switchTab(tabName) {
    tabButtons.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    tabContents.forEach(function (panel) {
      panel.classList.toggle('active', panel.id === 'tab-' + tabName);
    });
    history.replaceState(null, null, '#' + tabName);
    // Re-trigger scroll reveals for newly visible content
    requestAnimationFrame(function () {
      revealElements.forEach(function (el) {
        if (isInViewport(el)) {
          el.classList.add('visible');
        }
      });
    });
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      switchTab(btn.dataset.tab);
    });
  });

  // Load tab from URL hash
  var hash = window.location.hash.replace('#', '');
  if (hash === 'blog') {
    switchTab('blog');
  } else {
    switchTab('about');
  }

  /* ========== Scroll Reveal ========== */
  var revealElements = document.querySelectorAll('.reveal');

  function isInViewport(el) {
    var rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight - 60;
  }

  function onScroll() {
    revealElements.forEach(function (el) {
      if (isInViewport(el)) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('load', function () {
    onScroll();
  });

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial reveal for above-fold elements
  onScroll();
})();
```

- [ ] **Step 2: 提交**

```bash
git add assets/script.js && git commit -m "feat: add tab switching, theme toggle, and scroll reveal"
```

---

### Task 5: 创建示例 Blog 文章详情页

**Files:**
- Create: `blog/post-1.html`

- [ ] **Step 1: 写入文章详情页 HTML**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>示例文章标题 - SunXT</title>
  <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
  <header class="top-bar">
    <span class="site-name">SunXT</span>
    <div class="top-bar-right">
      <button class="theme-toggle" id="themeToggle" aria-label="切换主题">🌙</button>
    </div>
  </header>

  <main class="main-container">
    <a class="back-link" href="../index.html#blog">← 返回 Blog</a>

    <article class="blog-detail">
      <img class="blog-detail-cover" src="../assets/images/blog-placeholder.svg" alt="文章封面">

      <div class="blog-detail-date">2026-06-14</div>
      <h1 class="blog-detail-title">示例文章标题</h1>

      <div class="blog-detail-body">
        <p>这是文章正文的第一段。在这里可以自由书写你的内容。</p>
        <p>这是第二段。你可以使用 HTML 标签来排版：</p>
        <h2>小标题</h2>
        <p>段落内容。支持 <strong>加粗</strong>、<em>斜体</em>、<code>行内代码</code> 等基本样式。</p>
        <ul>
          <li>列表项一</li>
          <li>列表项二</li>
          <li>列表项三</li>
        </ul>
        <pre><code>// 代码块示例
console.log('hello world');</code></pre>
        <blockquote>
          <p>这是一个引用块，可以用来突出重要的内容或引用他人的话。</p>
        </blockquote>
      </div>
    </article>

    <div class="footer" style="margin-top: 40px;">
      <p>&copy; 2026 SunXT</p>
    </div>
  </main>

  <script src="../assets/script.js"></script>
</body>
</html>
```

- [ ] **Step 2: 提交**

```bash
git add blog/post-1.html && git commit -m "feat: add sample blog post detail page"
```

---

### Task 6: 添加占位图片和本地验证

**Files:**
- Create: `assets/images/bg.svg`
- Create: `assets/images/avatar.svg`
- Create: `assets/images/blog-placeholder.svg`

- [ ] **Step 1: 生成 SVG 占位图**

```bash
# 背景占位 — 深蓝渐变 SVG
cat > /Users/sunxt/github.io/assets/images/bg.svg << 'SVGEOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="50%" style="stop-color:#16213e"/>
      <stop offset="100%" style="stop-color:#0f3460"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#g)"/>
</svg>
SVGEOF

# 头像占位
cat > /Users/sunxt/github.io/assets/images/avatar.svg << 'SVGEOF'
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <rect width="200" height="200" rx="100" fill="#4a6cf7"/>
  <text x="100" y="120" text-anchor="middle" font-size="80" font-family="sans-serif" fill="white">S</text>
</svg>
SVGEOF

# 封面占位
cat > /Users/sunxt/github.io/assets/images/blog-placeholder.svg << 'SVGEOF'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400">
  <rect width="800" height="400" fill="#2a2a4a"/>
  <text x="400" y="210" text-anchor="middle" font-size="24" font-family="sans-serif" fill="rgba(255,255,255,0.3)">Cover Image</text>
</svg>
SVGEOF
```

- [ ] **Step 2: 本地验证**

用浏览器直接打开 `/Users/sunxt/github.io/index.html`，验证：

1. ✅ 页面正常渲染，背景显示渐变
2. ✅ 标签切换（个人简介 ↔ Blog）
3. ✅ 明暗主题切换按钮可用
4. ✅ URL hash 反映当前标签（#about / #blog）
5. ✅ Blog 文章卡片点击跳转详情页
6. ✅ 详情页「返回 Blog」链接可用
7. ✅ 滚动时卡片渐入动效
8. ✅ 响应式：调整窗口到手机宽度

- [ ] **Step 3: 提交**

```bash
git add -A && git commit -m "feat: add SVG placeholder images"
```
