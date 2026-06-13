# 个人主页设计方案

> 日期: 2026-06-14 | 状态: ✅ 已确认

## 概述

在 GitHub Pages 上搭建个人主页，纯静态 HTML/CSS/JS 实现。
风格：极简玻璃拟态（Glassmorphism），明暗双主题自动切换 + 手动切换。

## 技术选型

- **方案:** 纯静态 HTML + CSS + JS，零依赖
- **部署:** GitHub Pages（SunXT-0719.github.io）
- **文件结构:**

```
/index.html                    — 主页
/blog/post-1.html              — Blog 文章（示例）
/assets/
  style.css                    — 全局样式
  script.js                    — 交互逻辑
  images/                      — 用户上传（头像、背景、封面图）
```

## 页面结构

### 标签栏（固定顶部）
- 左侧: `个人简介` | `Blog` 两个标签
- 右侧: 明/暗主题切换按钮（☀️/🌙）
- 样式: 毛玻璃背景，粘性定位

### 个人简介页（Tab 1）

| 区域 | 内容 |
|------|------|
| Hero | 头像（用户上传）、姓名、一句话介绍 |
| 关于我 | 较长自我介绍段落，纯文本 |
| 项目展示 | 2-4 个项目卡片（名称、简述、链接），轻量展示 |
| 联系方式 | 社交媒体图标链接 / 邮箱 |

### Blog 页（Tab 2）

- 文章列表，每项包含: 标题、日期、封面图（可选）、摘要
- 点击跳转独立详情页（`/blog/post-N.html`）

### 文章详情页

- 返回 Blog 列表链接
- 标题、日期、封面图（可选）、正文内容

## 视觉设计

### 明暗主题

| 属性 | 浅色 | 深色 |
|------|------|------|
| 页面背景 | 用户上传图片 | 用户上传图片 |
| 卡片背景 | rgba(255,255,255,0.6) | rgba(255,255,255,0.06) |
| 卡片边框 | rgba(255,255,255,0.8) | rgba(255,255,255,0.1) |
| 文字主色 | #1a1a2e | #e8e8f0 |
| 文字辅色 | rgba(0,0,0,0.5) | rgba(255,255,255,0.5) |

### 玻璃拟态核心参数
- `backdrop-filter: blur(20px) saturate(180%)`
- `border-radius: 16px`（卡片），`24px`（标签）
- 细边框（1px）营造玻璃边缘

### 字体
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
             "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
```

### 动效
- 页面加载: 卡片从下方渐入（opacity + translateY）
- 标签切换: 内容区交叉淡入淡出
- 主题切换: CSS 变量过渡
- 悬停: 卡片轻微上浮 + 阴影增强
- 滚动: Intersection Observer 触发逐块渐入

## 交互细节

- 标签切换: 点击切换，URL hash 反映当前标签（`#about` / `#blog`）
- 主题切换: 默认 `prefers-color-scheme`，手动选择后存入 localStorage
- Blog 文章: 点击跳转独立页面
- 响应式: 移动端单栏满宽，桌面端居中最大宽度 640px

## 待用户提供

- 头像图片 → 替换 `/assets/images/avatar.jpg`
- 背景图片 → 替换 `/assets/images/bg.jpg`
- 个人姓名、介绍、项目信息 → 替换 HTML 中占位内容
- Blog 文章内容 → 新增 `/blog/` 下的 HTML 文件

## 实现步骤

1. 创建 `index.html` 主页面（双标签结构 + 个人简介内容）
2. 创建 `assets/style.css`（玻璃拟态 + 明暗主题 + 响应式）
3. 创建 `assets/script.js`（标签切换 + 主题切换 + 渐入动效）
4. 创建示例 Blog 文章详情页
5. 添加 `.gitignore`（排除 `.superpowers/`）
6. 本地预览验证
