# Smart Linkify 项目分析报告

> 分析对象：`d:/Programming/SmartHyperlinkRecognition`（Smart Linkify v1.0.5，main @ 5250ba7）
> 分析范围：静态代码审计 + **真实 Chrome 装载扩展实测**（2026-10-17，见 §7）、官网、脚本工具链、文档一致性、工程规范对齐度
> 结论摘要：**产品骨架清晰、代码量小、可维护性尚可；但存在 1 个 P0 级核心功能缺陷（已由实测确认），且"无测试 / 无 lint / 无 CI"与既有工程规则正面冲突。**

---

## 1. 项目定位与技术栈

| 维度 | 实际情况 |
| --- | --- |
| 产品 | Chrome 扩展：把网页纯文本 URL / 邮箱自动转成 `<a>` |
| 形态 | MV3 扩展（`extension/`）+ 纯静态官网（`website/`）+ Node 脚本（`scripts/`） |
| 技术栈 | 原生 JS（ES6+）+ 原生 CSS + 原生 HTML，**零运行时依赖、无构建步骤** |
| 依赖 | `devDependencies` / `dependencies` 均为空（`package.json:29-30`），官网仅 CDN 引 Font Awesome |
| 版本 | 1.0.5；`package.json` 为单一版本源，`scripts/sync-version.js` 同步 manifest / 官网 / README 徽章 |
| 发布 | Chrome Web Store 已上架；`dist/*.zip` 为本地手工打包产物（`npm run pack` 实为 echo） |
| 质量设施 | ❌ 无单元测试（`npm test` 仅 echo）❌ 无 lint ❌ 无 CI（无 `.github/`）|

规模：扩展 JS/CSS 约 60KB，官网约 90KB（其中 `website/js/i18n.js` 34KB、`website/css/style.css` 24KB）。

---

## 2. 模块职责

| 文件 | 职责 | 备注 |
| --- | --- | --- |
| `extension/manifest.json` | MV3 清单 | `<all_urls>` content script，`document_idle`，`all_frames:false` |
| `extension/content.js` | 核心转换引擎 | 白名单判定 → TreeWalker 遍历文本节点 → 正则替换 → MutationObserver 增量处理 |
| `extension/background.js` | Service Worker | 默认配置落地、配置迁移、白名单增删、Badge 计数/重置 |
| `extension/popup.*` | 弹窗 | 当前域启用开关、转换计数、主题/语言切换 |
| `extension/options.*` | 设置页 | 新标签打开、白名单、排除标签、严格模式、排除文件后缀、主题、语言 |
| `extension/welcome.html/javascript` | 首装引导 | 两个按钮跳转 |
| `extension/i18n.js` | 自建 i18n | 14KB 手写中/英词典，覆盖 popup + options + welcome |
| `extension/_locales/` | chrome.i18n | **仅 8 个 key**，只服务 manifest 名称/描述与少数 options 文案 |
| `website/*` | 官网 5 页 | index / docs / changelog / privacy + 自建 i18n + token 化 CSS |
| `scripts/sync-version.js` | 版本同步 | 同步 index.html、manifest、README 徽章 |
| `scripts/install-hooks.js` | pre-commit hook | 提交前自动同步并 stage 上述文件 |

数据流：`background` 写入 `chrome.storage.sync.config` → `content.js` 启动时读一次 → 命中白名单才 `init()` → 转换并 `sendMessage(updateLinkCount)` → `background` 写 Badge。

---

## 3. 问题清单

### P0-1 核心正则失效：绝大多数真实 URL 不会被转换 ⚠️ 最高优先级

`extension/content.js:17`

```js
urlPattern: /(?:https?:\/\/|ftp:\/\/|www\.)[a-zA-Z0-9][-a-zA-Z0-9]*(?:\.[a-zA-Z0-9][-a-zA-Z0-9]*)+\.[a-zA-Z]{2,}...
```

该正则要求"前缀之后至少 3 段标签"（`label` + 至少 1 个 `(?:\.[label])` + 末段 `\.[tld]`）。实测（直接 `eval` 提取源码正则后执行）：

| 输入 | 结果 |
| --- | --- |
| `https://example.com` | ❌ false |
| `www.example.com` | ❌ false |
| `www.google.com` | ❌ false |
| `https://github.com/user/project` | ❌ false |
| `example.com` / `example.com/page` | ❌ false |
| `https://www.github.com` | ✅ true |
| `ftp://files.example.com` | ✅ true |
| `http://a.b.c.com/x` | ✅ true |

即：**只有当域名是 3 段以上（如 `a.b.c.com`），且带协议或 `www.` 前缀时才生效**。README 与 `test.html` 中所有主推用例（`example.com`、`www.example.com`、`https://github.com/user/project`）全部不成立。该正则自 `05888a1` 首次提交后从未修改，属于长期潜伏缺陷，说明**用例从未被自动化验证过**（`test.html` 是人工目测页）。

补充：`test.html` 的验证路径本身也走不通 —— 它以 `file://` 打开，content script 默认不注入 file 协议，且 popup 明确把 `file:` 判为"不支持"（`popup.js:44`），而 `file://` 页面 hostname 为空，无法加入白名单。

> ✅ **真实浏览器复核（§7.3）**：装载扩展 + localhost 探针页，A/B/C/D/G 全部纯文本，只有 E/F/H/I 变链接，与上表逐条一致。

### P0-2 「默认什么都不做」的激活模型与文案不符

`content.js:87-90` 只在该域命中 `config.whitelist` 时才 `init()`；`background.js:14` 默认 `whitelist: []`。所以**装完扩展后任何网站都不生效**，必须逐站手动打开开关。
但 README `:62` 写"Visit any page... you'll notice these texts now have underlines"，`:21` 写"自动处理"。用户首装体验 = 完全无效果，且叠加 P0-1 后即使打开开关也大概率无效果。

> ✅ **真实浏览器复核（§7.2）**：首装后 `chrome.storage.sync` 中 `whitelist:[]`，探针页 3.5s 后 `bodyMarked:false`（`init()` 从未执行）、`autoLinks:0`。

### P1-1 contenteditable / 富文本区域无保护，会破坏用户输入

`content.js:8-16` 的排除表只有标签名（SCRIPT/STYLE/PRE/CODE/A…），未排除 `contenteditable`、`[role=textbox]`。在 Gmail 写信、Notion、在线文档里打字时，MutationObserver 会把输入文本改写成 `<a>`，属于**破坏性副作用**（`A` 标签虽然被排除，但用户输入的新文本是裸文本节点）。

> ✅ **真实浏览器复核（§7.5）**：向 `contenteditable` 内插入含合法 URL 的 `<span>`（模拟富文本粘贴），被改写为 `<a data-auto-link>`，且 span 被打上 `data-link-converted`。纯键盘逐字输入（直接产生文本节点）暂不触发。

### P1-2 只观察 `ELEMENT_NODE` 新增，纯文本更新会漏

`content.js:264-273` 只处理 `node.nodeType === ELEMENT_NODE` 的 `addedNodes`，且 `observer` 未开启 `characterData`。典型场景（聊天流追加文本节点、`textContent` 原地改写、虚拟列表复用节点）全部漏转。这与"实时处理动态内容"的卖点不完全一致。

> ✅ **真实浏览器复核（§7.4）**：追加**元素**（含合法 URL）→ 转换成功；`appendChild(textNode)` → 不转；`el.textContent = "…url…"` → 不转。

### P1-3 转换往宿主页面注入内联样式，破坏站点视觉

`content.js:241-243`：

```js
link.style.color = '#0066cc'
link.style.textDecoration = 'underline'
```

- 硬编码颜色，不随站点暗色模式/设计 token 变化；
- 用 `!important` 也无法覆盖、用内联样式又压过宿主 CSS，视觉一致性差；
- 无用户可配置项（与 README `:23` "highly configurable" 的承诺不符）。

### P1-4 性能与 DOM 污染

- 每个元素都被打上 `data-link-converted` 属性（`content.js:121`），大页面属性数量级膨胀；
- `processNode` 对每个新增元素都做整棵子树 TreeWalker，`acceptNode` 里还要**逐级向上遍历父链**（`content.js:127-133`），复杂度约 O(节点数 × 深度)；
- 每个文本节点都 `new RegExp(...)` 重建两次正则（`content.js:175`、`189`）；
- 全部同步执行在 MutationObserver 回调里，无 `requestIdleCallback` 分片。

> **实测修正（见 §7）**：500 个"含有效 URL"的段落一次性插入，31ms 内完成 500 次转换，**0 个 longtask**；2000 个纯文本段落也 **0 个 longtask**。故"性能瓶颈"目前**未获证据支持**，可降级为"待观察"；真正确定的是下面这条属性污染（2000 个节点 → 2000 个新增 `data-link-converted` 属性）。

### P1-5 配置默认值三处重复

`background.js:3-19`、`options.js:35-51`、`content.js:6-20` 各自维护一份配置默认值（且 content.js 那份**缺 `theme/lang/strictMode/excludeFileExt`**）。任何字段增删都要改三处，已出现内容漂移。

### P1-6 三套并行的国际化体系

1. `extension/i18n.js`（自建词典，实际渲染来源）
2. `extension/_locales/*/messages.json`（8 个 key，仅 manifest + 少量 options）
3. `website/js/i18n.js`（34KB，官网）

扩展侧两套并存：`_locales` 里的 `options_urlMatch_*` 与 `i18n.js` 的 `options.urlMatch.*` 语义重复，改文案必须改两处，且 `chrome.i18n` 能力（复数、占位符、社区翻译）完全没用起来。

### P1-7 无测试 / 无 lint / 无 CI，与既有工程规则直接冲突

- `package.json:21-28`：`test`、`pack`、`lint` 全是 `echo`
- `docs/superpowers/specs/2026-08-25-...design.md:37` 与 `plans/...:122` 却写着"运行 `npm run lint:tsc`" —— 该 script **从未存在**
- 无 `.github/`，PR 无任何自动化门禁；核心正则这类纯函数缺陷只能靠人工目测发现（事实已证明会漏）

### P2-1 扩展 CSS 完全没有 token 化

`extension/options.css`：**零个 CSS 自定义属性**，硬编码 hex 96 处；`popup.css` 61 处。暗色模式靠 `[data-theme='dark']` 与 `@media (prefers-color-scheme: dark)` 两套选择器重复展开（`options.css:417`、`:535`）。而官网 `style.css` 已经有完整 token 体系（`:2-83`），两套视觉语言不一致。

### P2-2 JS 里散落硬编码色值

`popup.js:133/141/154`（`#4CAF50`/`#F44336`/`#999`）、`background.js:92`（Badge `#4CAF50`）、`content.js:241`。Badge 色与扩展主色（`#2563eb`）也不统一。

### P2-3 官网图标体系半迁移

git 历史声称"emoji 图标换内联 SVG"，但：
- `website/index.html:16` 等 4 个页面仍 CDN 引 `font-awesome@6.4.0`（外部渲染阻塞依赖 + 隐私/CDN 可用性风险）；
- `index.html:95`、`privacy.html:200`、`docs.html:270`、`changelog.html:232` 仍用 `<i class="fas fa-bars">`；
- `website/js/main.js:76-93` 靠切换 `fa-bars`/`fa-times` class 实现汉堡菜单。

即同一产品内「内联 SVG（主题/语言图标）+ 图标字体（菜单/GitHub）」并存。

### P2-4 官网 JS 死代码与调试残留

`website/js/main.js`：
- `initNavbarScroll()`（`:61-64`）空函数；
- `:218-230` 运行时向 `head` 注入 `<style>`，重复定义 CSS 里已有的 `slideIn/slideOut`；
- `:233-256` `trackEvent` 只 `console.log`，却给所有 `.btn`（含主题切换按钮）绑了点击监听；
- `copyToClipboard` / `showNotification` 从未被调用。

### P2-5 官网 token 定义三份重复

`style.css`：`:root`（`:2-83`）、`[data-theme='dark']`（`:86-110`）、`@media (prefers-color-scheme:dark)`（`:112-137`）三处重复同一组颜色变量，改一个色要改三遍。

### P2-6 权限模型可收紧

`manifest.json:13-14`：`activeTab` + `host_permissions: <all_urls>` + content script 匹配 `<all_urls>`。既然实际是"白名单站点才干活"，用 `optional_host_permissions` + 按需注入（`chrome.scripting`）能显著降低商店审核与用户信任成本；`activeTab` 在此配置下也是冗余的。

### P2-7 交互与可访问性细节

- popup 的启用开关 `<input id="siteToggle">`（`popup.html:69`）无 `aria-label`，状态文本是兄弟节点，读屏用户拿到的是"未命名复选框"；
- options 的 `?` 帮助气泡把 `role="tooltip"` 的节点**放在触发它的 `<button>` 内部**并自引用 `aria-describedby`（`options.html:73-88`），按钮可及名与说明文本混为一体（虽有 `:focus-visible` 样式，语义仍不规范）；
- 官网 `.theme-toggle` 用内联 `onclick="i18n.toggle()"`（`index.html:87`），与事件绑定式代码风格不一致（也为严格 CSP 埋坑）。

### P2-8 弹窗开关的"父域删除"语义反直觉

`background.js:63-84`：在 `docs.github.com` 关闭开关时，若白名单里存的是 `github.com`，会把父域条目整条删掉 —— 用户以为只关了一个子域。CHANGELOG 1.0.4 把它当"修复"，但产品语义上更像新坑。

---

### P1-8【实测新增】`ftp://` 链接被二次加前缀，href 变成非法 URL

`content.js:228-234` 只判断 `!/^https?:\/\//i.test(href)`，于是 `ftp://files.example.com` 被补成 `http://ftp://files.example.com`。真实浏览器实测：`<a href="http://ftp://files.example.com">` —— **点击必坏**。而 README `:173` Roadmap 还把"支持 ftp://"列为待办，实际是"匹配到了但生成坏链接"。

### P2-9【实测新增】URL 尾部与 CJK 查询串处理粗糙

对 `urlPattern` 的边界实测：

| 输入文本 | 实际命中 | 问题 |
| --- | --- | --- |
| `https://www.github.com/a.` | `https://www.github.com/a.` | 句末句号被吞进 href |
| `https://www.github.com/path?q=中文` | `https://www.github.com/path?q=` | 中文参数被截断 → 坏链接 |
| `https://user:pass@www.github.com/x` | 无匹配 | 带认证信息的 URL 漏转 |
| `访问https://www.github.com了解详情` | `https://www.github.com` | ✅ 正确（中文紧贴不影响） |
| `见 www.github.com。` | 无匹配 | 裸 `www.` 前缀兜不住（P0-1 连带） |

### P2-10【实测新增】扩展自身的 `chrome-extension://` 页面被判为"可启用站点"

`popup.js:44` 的特殊页判定只列了 `chrome|about|edge|brave|file`。实测把 popup 打开在扩展页上时，`currentDomain` 显示扩展 ID 并允许打开开关 —— 用户可以给扩展自身页面加白名单（无意义且会产生无效存储项）。

---

## 4. 文档一致性审计（文档与代码已多处脱节）

| 文档位置 | 声明 | 实际 |
| --- | --- | --- |
| `README.md:23` | 用户可自定义**识别正则** | 没有任何 UI 写 `urlPattern`，存储里也无该字段 |
| `README.md:67-69` | 支持**网站黑名单** | 1.0.4 已改白名单模型 |
| `README.md:171` / `:173` | Roadmap：支持 `ftp://` | 正则能匹配 `ftp://`，但实测生成的 `href` 是 `http://ftp://…`（坏链，见 P1-8）；真正"支持"没做到，Roadmap 反而漏了它 |
| `README.md:54` vs `:106` | 加载未打包扩展：选 `extension` 目录 / 选项目根目录 | 自相矛盾，且正确的是 `extension/` |
| `README.md:139-142` | `docs/` 下有 `README.md`/`INSTALL.md`/`QUICKSTART.md` | 实际只有 `docs/superpowers/{plans,specs}` |
| `README.md:22` | 跳过 `<pre>/<code>/<script>` 等 | 属实（漏 `contenteditable`） |
| `website/README.md:7-8` | 官网"待部署" | 已上线 vercel，`package.json:34` 有 homepage |
| `website/README.md:30-35` | 技术栈含 Font Awesome | 与"图标换 SVG"的既定方向冲突 |
| `website/README.md:121-123` | 手动在 index.html 搜 `1.0.0` 改版本 | 已由 `sync-version.js` 自动化 |
| `docs/.../design.md:37` | `npm run lint:tsc` | script 不存在 |

`docs/superpowers/` 只有 2026-08-25 的 branding 计划与 spec，**没有架构说明 / 组件规则 / 字段 SoT**，新加入者只能靠读代码。

---

## 5. 与项目工程规则的对齐度

| 规则 | 状态 | 说明 |
| --- | --- | --- |
| 1 长期 > 短期 | ⚠️ | 白名单激活性 = 为规避误转的产品妥协，但未提供"全站默认开 + 站点黑名单"的降级路径；文档也未同步，长期是用户困惑来源 |
| 2 少 > 多 | ⚠️ | `popup` 的 `statsGrid` 只有一个卡片却用 grid 包裹；`website` 保留 `copyToClipboard`/`showNotification`/`initNavbarScroll`/`trackEvent` 死代码 |
| 3 一致 > 新鲜 | ❌ | 扩展 CSS 与官网 CSS 是两套视觉语言；图标体系同时存在内联 SVG 与 Font Awesome |
| 4 视觉 token 化 | ❌ | 扩展侧 157 处硬编码 hex、零自定义属性；JS 里 5 处硬编码色 |
| 5 动效与图标克制 | ⚠️ | 官网 CSS 有 `prefers-reduced-motion`（1 处），但 `main.js:155-179` 用 JS 写 `opacity/transition` 做入场动画，**绕过了 reduced-motion**；图标来源不统一 |
| 6 架构单向分层 | N/A→⚠️ | 纯静态无框架分层；但 content/background/options 三处各自持有配置默认值与白名单判定逻辑，缺单一来源 |
| 7 类型严格 | ❌ | 无 TypeScript、无 JSDoc、无 lint；`npm run lint` 是 echo |
| 8 新依赖先论证 | ✅ | 零 npm 依赖，克制（但 CDN Font Awesome 是隐式外部依赖，未论证） |
| 9 跨文件改动先写计划 | ✅ | `docs/superpowers/plans` 有落地先例 |
| 10 文档同步责任 | ❌ | §4 表格中 8 处脱节 |
| 11 改动一律走 PR | ✅ | git 历史均为 `Merge pull request #N`，规范 |

---

## 6. 建议行动顺序（仅建议，未改动任何代码）

**阶段 0｜止血（P0，1 个 PR）**
1. 修 `urlPattern`，补 `example.com` / `www.x.com` / 无协议域名支持；同时把 `emailPattern` 的 `[A-Z|a-z]`（`:18`，`|` 是字面量成员）清理干净。
2. 修 `ftp://` 二次加前缀（P1-8）：改为"无协议才补 `http://`"，或直接按 scheme 白名单判断。
3. 把正则抽成**可被 Node 直接 `require` 的纯模块**，配 `node:test` 用例（正例/反例各 15~20 条，覆盖 `test.html` 现有全部用例 + P2-9 的边界用例）。
4. 修 `test.html` 的可验证路径（改为 `localhost` 起服务器 + 提示需加入白名单；当前的 `file://` 路径永远测不出东西）。

**阶段 1｜一致性与健壮性（P1，2~3 个 PR）**
4. 排除 `contenteditable` / `[role=textbox]`；观察 `characterData` 与文本节点新增。
5. 配置默认值收敛为 `extension/config.js` 单一来源，三处 `require`/引入。
6. 扩展 CSS 引入与官网同名的 token 层（`--color-*` / `--space-*` / `--dur-*`），消掉暗色模式的三处重复展开。
7. 转换出的 `<a>` 改为 class（如 `.smart-linkify`）+ 注入一份可切换的样式表，支持暗色与站点覆盖。

**阶段 2｜工程门禁（P1，1 个 PR）**
8. 落地 `lint`（ESLint + 预热规则集），把 `lint:tsc`（或改名 `typecheck`）真正加上或从文档删除。
9. 加 GitHub Actions：`node --test` + `lint` + manifest 合法性校验 + 版本一致性校验（`npm run sync-version --check`）。
10. 更新 README / website/README / spec 中所有与实现脱节的条目（§4 全表）。

**阶段 3｜可选优化（P2）**
11. 官网图标统一为内联 SVG，移除 Font Awesome CDN；清理 `main.js` 死代码与运行期注入样式。
12. 权限收窄为 `optional_host_permissions` + 按需注入。
13. 官网三份 token 合并为一份（`[data-theme]` + `@media` 只保留一层覆盖）。

---

## 7. 浏览器实测记录（2026-10-17）

### 7.1 方法

| 项目 | 内容 |
| --- | --- |
| 浏览器 | 通过 chrome-devtools MCP 连接的真实 Chrome（`--autoConnect`） |
| 扩展 | `install_extension("extension/")` 真实装载未打包扩展，id `lecpfggmlpfkmiajffaodfghbkicebda`，版本 1.0.5 |
| 探针页 | `http://127.0.0.1:8765/probe.html`（本地 node 静态服务器，模拟真实 http 站点，规避 `file://` 不注入的问题） |
| 探针页文件 | `dist/probe/probe.html`、`dist/probe/serve.js`（已留在仓库，`dist/` 被 gitignore） |
| 截图 | `dist/probe/shot-probe.png`、`shot-popup.png`、`shot-options.png`、`shot-site-mobile.png` |
| 收尾 | 测试页/标签全部关闭、扩展已卸载、两个本地 server 已停止 |

### 7.2 结论 1：默认安装后**任何页面都不生效**（P0-2 确认）

装载后立即读 `chrome.storage.sync`：

```json
{"config":{"excludeFileExt":true,"excludedTags":["SCRIPT","STYLE","NOSCRIPT","TEXTAREA","PRE","CODE","A"],"lang":"auto","openInNewTab":true,"strictMode":true,"theme":"auto","whitelist":[]}}
```

访问探针页 3.5s 后：

```json
{"autoLinks":0,"bodyMarked":false,"markedElements":0}
```

`bodyMarked:false` 说明 `content.js` 的 `init()` **根本没有执行**（`isWhitelisted()` 为 false）。即：新装用户在所有网站上"看起来像没装"。

### 7.3 结论 2：把站点加入白名单后，转换依然大面积失效（P0-1 确认）

设置 `whitelist:["127.0.0.1"]` 并重载页面，逐用例结果：

| 用例 | 文本 | 期望 | 实测 |
| --- | --- | --- | --- |
| A | `https://example.com` | 转换 | ❌ 纯文本 |
| B | `www.example.com` | 转换 | ❌ 纯文本 |
| C | `https://github.com/user/project` | 转换 | ❌ 纯文本 |
| D | `www.google.com` | 转换 | ❌ 纯文本 |
| E | `https://www.github.com` | 转换 | ✅ `<a href="https://www.github.com">` |
| F | `contact@example.com` | 转换 | ✅ `mailto:` |
| G | `example.com/page` | 转换 | ❌ 纯文本 |
| H | `https://sub.domain.co.uk/path?x=1` | 转换 | ✅ |
| I | `ftp://files.example.com` | 转换 | ⚠️ 转了，但 `href="http://ftp://files.example.com"` |
| J | 已在 `<a>` 内的 URL | 跳过 | ✅ 未动 |
| K | `<code>` 内的 URL | 跳过 | ✅ 未动 |

`autoLinks` 稳定为 4（E/F/H/I），重载复现一致。**真实浏览器与正则单元验证完全吻合**，P0-1 不是误判。

### 7.4 结论 3：MutationObserver 只覆盖"新增元素"，纯文本变更全部漏掉（P1-2 确认）

在页面内注入（均使用**合法 3 段域名**，排除正则因素）：

| 操作 | 结果 |
| --- | --- |
| `host.appendChild(document.createTextNode(' https://www.github.com/textnode-valid'))` | ❌ 不转换 |
| `div.appendChild(span)`（span 内含合法 URL） | ✅ 转换 |
| `el.textContent = ' https://www.github.com/mutated-valid'`（原地改写） | ❌ 不转换 |

即聊天流、虚拟列表、`textContent` 局部刷新、`characterData` 更新场景全部失效 —— 与"实时处理动态内容"的卖点有实质差距。

### 7.5 结论 4：`contenteditable` 未受保护，富文本粘贴会被改写（P1-1 确认）

在 `contenteditable` 区域内插入一个含合法 URL 的 `<span>`（模拟富文本粘贴 / 框架重建节点），实测被改写成链接：

```html
<span data-link-converted="true"> <a href="https://www.github.com/pasted" target="_blank" rel="noopener noreferrer" data-auto-link="true" style="color: rgb(0, 102, 204); text-decoration: underline;">…</a></span>
```

编辑器里用户的文本被改写成链接，且该 `<span>` 被打了 `data-link-converted` 标记 —— **确认会污染可编辑区域**。纯键盘逐字输入（直接产生文本节点）暂不受影响，属于"看运气"。

### 7.6 结论 5：属性污染量化确认，但性能担忧未复现（P1-4 部分修正）

- 追加 200 个纯文本段落 → `[data-link-converted]` 从 5 增至 **205**（1:1 污染），页面总元素 238 个。
- 追加 2000 个段落 → 2000 个属性，**longtask = 0**。
- 一次性插入 500 个各含 1 个有效 URL 的段落 → **31ms 完成 500 次转换，longtask = 0**。

结论：本文初稿对"性能可能卡顿"的担忧**在小样本下不成立**，应降级为"待观察"；确定成立的只有 DOM 属性污染与内联样式注入。

### 7.7 结论 6：功能链路本身是通的（正面确认）

| 能力 | 实测 |
| --- | --- |
| 首装打开 welcome 页 | ✅ `background.js:27` 生效 |
| Badge 计数 | ✅ 服务端读回 `badge:"6"`，与页面实际转换数一致 |
| Popup 渲染 / 主题 / i18n 切换 | ✅ 深色模式渲染正常，`v1.0.5` 显示正常 |
| 设置页渲染 | ✅ 布局完整，工具提示默认 `visibility:hidden/opacity:0`（hover/focus 才显示） |
| Console / SW 报错 | ✅ 探针页、官网、Service Worker **均无任何 error/warn** |

> 顺带确认：`options` 页 `getComputedStyle(:root)` 读不到 `--color-bg`（`rootHasTokens:false`），暗色模式下 header 仍是写死的 `linear-gradient(135deg,#2563eb,#1e40af)` —— P2-1「扩展侧无 token」得到运行时证据。

### 7.8 结论 7：官网移动端菜单依赖外部 CDN（P2-3 确认）

390px 视口下：`.mobile-menu-toggle i` 的 `::before` content 解析为 FA 字形、`font-family: "Font Awesome 6 Free"`，点击后 `nav-menu` 变 `active`、图标 class 由 `fa-bars` 切到 `fa-times`、`display:flex` —— **功能正常**。但这枚"汉堡按钮"完全依赖 `cdnjs.cloudflare.com`，CDN 不可达时按钮将变成**空白可点区域**（无内联 SVG 兜底）。同时截图可见：GitHub 图标是 FA、主题图标是内联 SVG，两套体系并存。

---

## 8. 一句话总结

这是一个**文档写得比代码更完整**的小型扩展项目：架构轻、依赖零、PR 流程规范，但**核心转换正则实际不覆盖任何常见 URL 形态**（P0，已由真实浏览器实测确认：`example.com` / `www.x.com` / `github.com/user/project` 全部不转），叠加"默认不激活"的白名单模型，导致新装用户的体感是"扩展装了个寂寞"；同时扩展侧缺失 token 体系、缺失测试/lint/CI，与既定的 11 条工程规则有 5 条正面冲突。**建议先修 P0 并补上第一道自动化门禁，再谈视觉与架构收敛。**

> 反过来也值得记一笔：Badge 计数、welcome 引导、popup/options 渲染、i18n 切换、官网移动端菜单这些"外围"反而都工作正常 —— 问题高度集中在**转换引擎这一个文件**（`content.js` 的 1 条正则 + 1 个观察器）。这也意味着 P0 的修复成本很低，一个 PR 就能把产品从"基本不可用"拉回"符合宣传"。


