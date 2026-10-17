# 宣传图（Chrome 应用商店 / 官网）

所有宣传图都是**版式页 + 真实 UI 截图**渲染出来的，不手绘、不拼图。改文案或改版式后重跑一条命令即可得到全套新图。

## 一键出图

```bash
npm run promo        # 中英双语 × 全部版式（26 张）
npm run promo -- en  # 只出英文
```

产物分两层：

- `marketing/out/library/` —— 全量母版 26 张，含备选语言 / 主题，用于挑选和迭代
- `marketing/out/store/` —— **上传用的整理包**，按商店后台字段命名，见「商店上传清单」

## 目录结构

```
marketing/
├── copy.js          # 中英文案（唯一来源，改文字只动这里）
├── promo.css        # 版式系统（引用 extension/shared/tokens.css，只新增画布尺寸/展示字号）
├── promo.js         # 运行时：读 ?lang= / ?theme=，填文案与截图
├── templates/       # 版式页，每张图一个
├── assets/          # 真实 UI 截图（见下节「采集素材」）
└── out/
    ├── library/     # 全量母版
    └── store/       # 商店上传包（由脚本自动整理）
```

## 版式清单

| 版式 | 尺寸 | 用途 |
| --- | --- | --- |
| `store-01-hero` | 1280×800 | 商店截图 1：主视觉 + 弹出面板 |
| `store-02-autolink` | 1280×800 | 商店截图 2：真实网页转链效果 |
| `store-03-popup` | 1280×800 | 商店截图 3：弹出面板状态说明 |
| `store-04-options` | 1280×800 | 商店截图 4：设置页与匹配精度 |
| `promo-440x280` | 440×280 | 商店小宣传图块 |
| `promo-1400x560` | 1400×560 | 商店横幅（争取推荐位） |
| `og-1280x640` | 1280×640 | GitHub / 官网分享卡片 |
| `poster-1080x1440` | 1080×1440 | 竖版海报（社媒 / 公众号） |

除海报固定深色、小图块与分享卡固定品牌渐变外，商店四张截图都支持浅色 / 深色两套。

## 商店上传清单

`out/store/` 已按 Chrome 应用商店后台字段命名，直接拖拽即可（依据 `developer.chrome.com/docs/webstore/images`）：

| 后台字段 | 我们提供的文件 | 规格 |
| --- | --- | --- |
| 扩展图标（必填） | `icon-128.png` | 128×128，图形 96 + 四周 16px 透明边 |
| 截图（必填 1–5 张） | `zh_CN/1-hero.png` … `5-popup-dark.png` | 1280×800，满幅直角，24-bit 无透明 |
| 截图（英文列表） | `en/1-hero.png` … `5-popup-dark.png` | 同上 |
| 小促销图（必填） | `small-promo-440x280.png` | 440×280，**不支持按语言本地化**，默认英文版 |
| Marquee 促销图（选填） | `marquee-1400x560.png` | 1400×560，只有上传才可能进精选位，默认英文浅色 |

截图顺序即展示顺序：主视觉 → 真实转链效果 → 弹出面板 → 设置页 → 深色主题。

> 商店图标单独出 `icon128-store.png`（`extension/icons/`）；扩展包内的 16/32/48/96/128/256 仍用满幅版本，不要混用。
> 小促销图与 Marquee 若想换语言/主题，改 `scripts/render-promo.js` 的 `STORE_GLOBAL` 即可，`out/library/` 里有两版备选。

## 渲染管线

`scripts/render-promo.js` 用本机 Chrome 的 headless 模式**按目标像素尺寸开窗口**逐个截图，零依赖：

- Chrome 路径自动探测，找不到时用环境变量 `CHROME_PATH` 指定
- 输出尺寸 = `--window-size`，不依赖缩放，1280×800 就是 1280×800
- 一次渲染一个独立进程，互不影响
- 渲染完自动把商店所需文件复制到 `out/store/`，命名与后台字段对齐（映射表见文件顶部 `STORE_GLOBAL` / `STORE_SCREENSHOTS`）

## 采集素材（UI 截图）

`assets/` 里的图片是从**真实运行中的扩展**截下来的，不是手绘稿。扩展 UI 改动后需要重采：

1. 在 Chrome 里加载 `extension/`（`chrome://extensions` → 开发者模式 → 加载已解压的扩展程序）
2. 用 DevTools 打开对应页面，设置设备像素比 2、宽度与页面一致，截图：
   - `ui-popup-{light,dark}[-en].png` — `popup.html`，宽 320
   - `ui-options-{light,dark}[-en].png` — `options.html`，宽 1000，**截图前隐藏页面 banner**（`header{display:none}`），否则版式里要额外裁切
   - `ui-demo-{light,en}.png` — 打开 `assets/demo.html` / `demo-en.html`（需把站点加入扩展白名单，转链才会生效）
3. 深色版把主题切到 dark 后重截；英文版先把界面语言切到 English

> `assets/demo.html` / `demo-en.html` 是**示例宿主网页**，只用于展示「裸链接被转成蓝色链接」的真实效果。

## 约定

- 文案只写在 `copy.js`；模板里禁止硬编码中英文句子
- 颜色 / 圆角 / 阴影只引用 `extension/shared/tokens.css` 的变量（用 `var(--token, fallback)` 兜底）
- 版式里新增的颜色只允许出现在 `promo.css` 的 canvas 层（画布底色、柔光）
