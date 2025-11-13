# 🪶 ym-release

> 🚀 一键发布工具：支持 **Gitee** 与 **GitHub** 的 Release 创建与附件上传。

`ym-release` 是一个轻量级 TypeScript 工具库，用于自动化发布流程。  
它可以帮你：

- 创建新版本 Release（支持 Gitee / GitHub）
- 上传多个构建文件或资源到对应 Release
- 支持 Node.js 18+ 环境的原生 `fetch` / `FormData` / `File` 接口

## ✨ 特性

- 🧩 **跨平台支持**：同时兼容 Gitee 与 GitHub
- 📦 **多文件上传**：支持批量附件上传
- ⚙️ **TypeScript 原生开发**：类型完善、易于扩展
- 🧠 **无第三方依赖**：基于 Node 18+ 原生 API 实现
- 🔑 **自动分支与标签管理**：可指定 tag、branch 或 commit

## 📦 安装

```bash
# npm
npm install ym-release

# pnpm
pnpm add ym-release
```
