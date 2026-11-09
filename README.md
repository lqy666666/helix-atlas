# Helix Atlas

面向生物医学入门课程的 DNA 序列可视化工具。首页使用用户提供的 DNA 视频，通过青蓝、紫罗兰与暖粉环境光合成和调色呈现更明亮的画面，静音循环播放，仅有一个进入按钮。用户提供的无字分子图片用作实验室、图谱和指南页面的背景。

## 运行

需要 Node.js 20 或更新版本。在项目目录执行：

```bash
npm install
npm run dev
```

浏览器打开终端显示的本地地址。`npm run build` 可生成生产版本。

## 页面与功能

- 首页 `/`：全屏 DNA 视频和进入按钮。
- 序列实验室 `/lab`：输入 DNA 或 FASTA，查看长度、GC 含量、碱基统计及 ORF 概览。
- 序列图谱 `/map`：大幅 DNA 双链配对图，支持旋转双螺旋示意、展开逐位配对、点击碱基详情和按位置跳转；下方保留三轨序列、RNA 转录结果和三个正向阅读框。
- 学习指南 `/guide`：交互式碱基配对和基础概念。

序列最长 10,000 bp。ORF 检测仅用于教学，扫描输入链的三个正向阅读框；不用于基因预测或临床判断。

双链图的青绿色骨架对应用户输入链（5′→3′），紫色骨架对应互补链（3′→5′）。每一组字母来自当前已分析序列；每段最多 120 bp，可翻页查看全部，图内可以滚动。A–T 显示 2 条氢键，C–G 显示 3 条。此模块为结构与配对教学示意，非原子级分子模型。

工作区正文、表单、导航和序列字母采用更大的字号与高对比文字；手机端支持换行和图内滚动。

## 设计 Skill 的调用

在 Codex 对话中直接写出 skill 名称和目标即可，例如：

> 请使用 `$visual-taste-lab` 和 `$frontend-design`，根据我发的参考图优化 Helix Atlas 首页的构图与色彩。

> 请使用 `$build-web-apps:frontend-testing-debugging`，检查手机端的布局、按钮交互与控制台错误，并修复发现的问题。

本项目还使用了 `$color-systems`、`$animation-choreography`、`$anti-slop` 和 `$build-web-apps:react-best-practices` 的设计与实现规范。视觉决策见 `docs/design-language.md`。

---

## 在线演示

- 站点地址：部署完成后为 `https://<你的用户名>.github.io/helix-atlas/`
- 仓库内置 GitHub Actions：推送到 `main` 分支即自动构建并发布到 GitHub Pages。

## 部署

### 自动部署（已配置）

1. 把代码推送到 `main` 分支。
2. 打开仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。
3. 等待 Actions 中的 `Deploy to GitHub Pages` 跑完，GitHub 会给出站点地址。

### 本地复现「子路径」构建

```bash
VITE_BASE=/helix-atlas/ npm run build
```

`vite.config.js` 读取环境变量 `VITE_BASE` 作为静态资源前缀；不设置时按 `/` 构建，`npm run dev` 的行为与之前完全一致。

### 客户端路由

项目使用 History API 做路由（`/lab`、`/map`、`/guide`）。部署到 GitHub Pages 时，构建步骤会把 `dist/index.html` 复制为 `dist/404.html`，因此直接访问或刷新子路径不会出现 404。

## 目录结构

```
helix-atlas/
├─ index.html
├─ vite.config.js
├─ public/
│  ├─ images/            # 首页与内页背景
│  └─ videos/            # 首页 DNA 视频
├─ src/
│  ├─ App.jsx            # 路由与序列状态
│  ├─ components/        # Shell、双链图、序列轨道等
│  ├─ lib/sequence.js    # 解析、GC 含量、ORF 扫描
│  └─ pages/             # 首页 / 实验室 / 图谱 / 指南
├─ docs/
│  └─ design-language.md # 视觉决策说明
└─ .github/workflows/deploy.yml
```

## 许可证

MIT，全文见 [LICENSE](LICENSE)。

## 声明

本项目为课程作业性质的教学演示，序列分析结果仅用于教学，不构成医学或临床建议。
