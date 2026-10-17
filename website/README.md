# 智能超链接识别 - 官网

这是智能超链接识别 Chrome 扩展的官方网站。

## 🌐 在线访问

-   **官网地址：** https://smart-linkify.vercel.app/
-   **部署方式：** Vercel，根目录指向 `website/`

## 📁 目录结构

```
website/
├── index.html          # 首页
├── docs.html           # 文档
├── changelog.html      # 更新日志
├── privacy.html        # 隐私政策
├── css/
│   └── style.css       # 设计 token + 全站样式
├── js/
│   ├── main.js         # 主题 / 导航 / FAQ / 滚动交互
│   ├── i18n.js         # 中英文案
│   └── changelog.js    # 更新日志渲染
└── images/             # 图片资源
```

## ✨ 功能特性

-   🎨 现代化的设计风格
-   📱 完全响应式布局
-   ⚡ 流畅的动画效果
-   🔍 SEO 优化
-   🚀 快速加载

## 🛠️ 技术栈

-   **HTML5** - 语义化标签
-   **CSS3** - 设计 token（颜色 / 间距 / 圆角 / 动效单一来源）+ 现代布局
-   **JavaScript** - 原生 ES6+，无框架、无构建
-   **图标策略**
    -   功能性图标（移动端菜单开关等）：**内联 SVG**，不依赖网络
    -   装饰性图标（GitHub、功能卡片等）：Font Awesome 6（CDN）

## 🌗 主题

`js/main.js` 把用户选择或系统偏好解析后写入 `<html data-theme>`，CSS 只保留 `[data-theme='dark']` 一层覆盖，不再用 `@media (prefers-color-scheme)` 重复一份变量。


## 🚀 本地运行

### 方法 1: 直接打开

直接在浏览器中打开 `index.html` 文件即可。

### 方法 2: 使用本地服务器

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js (http-server)
npx http-server

# 使用 PHP
php -S localhost:8000
```

然后访问 `http://localhost:8000`

## 📦 部署

### GitHub Pages

1. 将代码推送到 GitHub 仓库
2. 进入仓库设置 → Pages
3. 选择分支和 `/website` 目录
4. 保存并等待部署完成

### Netlify

1. 连接 GitHub 仓库
2. 设置构建目录为 `website`
3. 点击部署

### Vercel

```bash
cd website
vercel
```

## 🎨 自定义

### 修改颜色主题

编辑 `css/style.css` 中的 CSS 变量：

```css
:root {
	--primary-color: #2563eb;
	--secondary-color: #1e40af;
	--gradient: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}
```

### 修改内容

编辑 `index.html` 中的相应部分。

### 添加新页面

1. 创建新的 HTML 文件
2. 复制 `index.html` 的头部和导航
3. 添加自定义内容
4. 更新导航链接

## 📝 内容区块

官网包含以下主要区块：

1. **导航栏** - 固定顶部导航
2. **英雄区域** - 产品介绍和 CTA
3. **功能特性** - 核心功能展示
4. **实时演示** - 转换效果对比
5. **使用场景** - 应用场景说明
6. **下载安装** - 安装指南
7. **文档资源** - 文档链接
8. **FAQ** - 常见问题
9. **页脚** - 链接和版权信息

## 🔧 维护

### 更新版本号

不要手改 `index.html`。以 `package.json` 的 `version` 为准，执行：

```bash
npm run sync-version
```

该脚本会同步 `manifest.json`、`index.html`（`#siteVersionDisplay`）与两份 README 的版本徽章。


### 添加新功能

1. 在 `index.html` 的功能区块添加新卡片
2. 确保样式一致
3. 测试响应式布局

### 优化性能

-   压缩 CSS 和 JS 文件
-   优化图片大小
-   使用 CDN 加载外部资源
-   启用浏览器缓存

## 📊 SEO 优化

已包含的 SEO 优化：

-   ✅ 语义化 HTML 标签
-   ✅ Meta 描述和关键词
-   ✅ Open Graph 标签（可添加）
-   ✅ 结构化数据（可添加）
-   ✅ 移动端友好
-   ✅ 快速加载

### 建议添加

在 `<head>` 中添加：

```html
<!-- Open Graph -->
<meta property="og:title" content="智能超链接识别" />
<meta
	property="og:description"
	content="自动将网页中的纯文本 URL 转换为可点击的超链接"
/>
<meta property="og:image" content="images/og-image.png" />
<meta property="og:url" content="https://yourwebsite.com" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="智能超链接识别" />
<meta
	name="twitter:description"
	content="自动将网页中的纯文本 URL 转换为可点击的超链接"
/>
<meta name="twitter:image" content="images/twitter-card.png" />
```

## 🎯 待办事项

-   [ ] 添加更多截图和演示视频
-   [ ] 创建英文版本
-   [ ] 添加用户评价区块
-   [ ] 集成 Google Analytics
-   [ ] 添加博客功能
-   [ ] 创建更新日志页面

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

-   GitHub Issues: [项目地址]/issues
-   Email: your-email@example.com

## 📄 许可证

MIT License - 详见 [LICENSE](../LICENSE) 文件

---

Made with ❤️ by Smart Linkify – Instant hyperlink conversion Team
