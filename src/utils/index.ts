import fs from "fs";
import { basename } from "path";

//判断文件是否存在
export const existsFile = (path: string) => {
  return fs.existsSync(path);
};

//读取文件
export const readFile = (path: string) => {
  const buffer = fs.readFileSync(path);

  return new File([buffer], basename(path));
};

//格式化版本
export const formatVersion = (version: string) => {
  const [major, minor, patch] = version.split(".").map(Number);

  return major * 10000 + minor * 100 + patch;
};
