# 如何写 Blog

## 1. 创建文章文件

在 `blog/` 目录下新建 HTML 文件，命名：`post-N.html`（N 递增）或 `project-xxx.html`（项目类）。

复制模板 `blog-template.html`（根目录）开始写。

---

## 2. 正文常用格式

| 用途 | 写法 |
|------|------|
| 段落 | `<p>文字</p>` |
| 小标题 | `<h2>标题</h2>` |
| 加粗 | `<strong>文字</strong>` |
| 斜体 | `<em>文字</em>` |
| 行内代码 | `<code>git push</code>` |
| 链接 | `<a href="https://..." target="_blank" rel="noopener">链接</a>` |

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

把图片放到 `assets/images/`，正文引用（文章页用 `../`）：

```html
<img src="../assets/images/图片名.png" alt="描述" style="max-width:100%;border-radius:8px;margin:1em 0;">
```

---

## 4. 设置封面

在 `<article class="blog-detail">` 内、正文前加：

```html
<img class="blog-detail-cover" src="../assets/images/cover.jpg" alt="文章封面">
```

**没有封面就删掉这行**，不留空 `<img>`（src 为空会产生灰色占位块）。

---

## 5. 加入 Blog 列表

打开 `sections/blog.html`，在 `<div class="blog-list">` 里添加卡片：

```html
<a class="card blog-item reveal" href="blog/post-3.html" data-category="其他" data-keywords="关键词1 关键词2">
  <!-- 有封面的加这行 -->
  <img class="blog-item-image" src="assets/images/cover.jpg" alt="封面">
  <div class="blog-item-body">
    <div class="blog-item-date">2026-06-15</div>
    <div class="blog-item-title">文章标题</div>
    <div class="blog-item-excerpt">简短摘要，一两句话。</div>
  </div>
</a>
```

> **注意**：`sections/blog.html` 里的资源路径是 `assets/...`（不带 `../`），因为它被 `index.html` 动态加载。

### 分类

`data-category` 支持：`全部` `项目` `学业` `其他`。填好后自动支持筛选。

### 关键词

`data-keywords` 用空格分隔，影响搜索结果。尽量覆盖文章中的关键术语。

---

## 6. 推送上线

```bash
cd /Users/sunxt/github.io
git add -A
git commit -m "blog: 新增文章 - 文章标题"
git push
```

等 1-2 分钟 GitHub Pages 部署，刷新 https://sunxt-0719.github.io/ 即可。
