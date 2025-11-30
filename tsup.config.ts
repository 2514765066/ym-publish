import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // 入口文件
  format: ["cjs", "esm"], // 输出格式，可选：'iife', 'esm', 'cjs'
  minify: true, // 是否压缩
  sourcemap: false,
  clean: true, // 清空 dist
  splitting: false, // 禁止代码分割 → 确保生成单文件
  treeshake: true, // 启用摇树优化
  outDir: "dist", // 输出目录
  dts: true,
});
