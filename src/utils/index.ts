import { readFileSync } from "fs";
import { basename } from "path";
import crypto from "crypto";

//读取文件
export const getFile = (path: string) => {
  const buffer = readFileSync(path);

  return new File([buffer], basename(path));
};

//格式化版本
export const formatVersion = (version: string) => {
  const [major, minor, patch] = version.split(".").map(Number);

  return major * 10000 + minor * 100 + patch;
};

//获取md5
export const getFileMD5 = (path: string) => {
  const buffer = readFileSync(path);
  const hash = crypto.createHash("md5");
  hash.update(buffer);
  return hash.digest("hex");
};
