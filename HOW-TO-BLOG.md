# 如何写 Blog

## 1. 创建文章文件

在 `blog/` 目录下新建 HTML 文件，命名：`post-N.html`（N 递增）。

复制下面的模板开始：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>文章标题 - SunXT</title>
  <link rel="icon" href="../assets/images/avatar.jpg">
  <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
  <header class="top-bar">
    <span class="site-name">SunXT's Homepage</span>
  </header>

  <main class="main-container">
    <a class="back-link" href="../index.html#blog">← 返回 Blog</a>

    <article class="blog-detail">

      <!-- 封面图（可选，没有就删掉这行） -->
      <img class="blog-detail-cover" src="../assets/images/xxx.jpg" alt="文章封面">

      <div class="blog-detail-date">2026-06-14</div>
      <h1 class="blog-detail-title">文章标题</h1>

      <div class="blog-detail-body">
        <!-- 正文写在这里 -->
      </div>

    </article>

    <footer class="footer">
      <p>&copy; 2026 SunXT</p>
    </footer>
  </main>

  <script src="../assets/script.js"></script>
</body>
</html>
```

---

## 2. 正文常用格式

| 用途 | 写法 |
|------|------|
| 段落 | `<p>文字</p>` |
| 小标题 | `<h2>标题</h2>` |
| 加粗 | `<strong>文字</strong>` |
| 斜体 | `<em>文字</em>` |
| 行内代码 | `<code>git push</code>` |
| 链接 | `<a href="https://..." target="_blank" rel="noopener">链接文字</a>` |

### 无序列表
```html
<ul>
  <li>列表项一</li>
  <li>列表项二</li>
</ul>
```

### 代码块
```html
<pre><code>console.log('hello world');</code></pre>
```

### 引用块
```html
<blockquote><p>引用文字</p></blockquote>
```

---

## 3. 插入图片

先把图片放到 `assets/images/`，然后在正文引用：

```html
<img src="../assets/images/图片名.png" alt="描述" style="max-width:100%;border-radius:8px;margin:1em 0;">
```

---

## 4. 设置封面

在 `<article class="blog-detail">` 内部、正文之前加一行：

```html
<img class="blog-detail-cover" src="../assets/images/cover.jpg" alt="文章封面">
```

**没有封面就不写这行**，不留空位。

---

## 5. 加入 Blog 标签页

打开 `sections/blog.html`，在 `<div class="blog-list">` 里添加卡片：

```html
<a class="card blog-item reveal" href="blog/post-3.html">
  <!-- 有封面就加这行，没有就跳过 -->
  <img class="blog-item-image" src="assets/images/cover.jpg" alt="文章封面">
  <div class="blog-item-body">
    <div class="blog-item-date">2026-06-15</div>
    <div class="blog-item-title">文章标题</div>
    <div class="blog-item-excerpt">简短摘要，一两句话。</div>
  </div>
</a>
```

> **注意：** `sections/blog.html` 里的图片路径是 `assets/images/...`（不是 `../assets/...`），因为它会被 index.html 加载。

---

## 6. 推送上线

```bash
cd /Users/sunxt/github.io
git add -A
git commit -m "blog: 新增文章 - 文章标题"
git pull --rebase && git push
```

等 1-2 分钟，刷新 https://sunxt-0719.github.io/ 即可。
