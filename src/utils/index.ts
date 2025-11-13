import fs from "fs";
import { basename } from "path";
import crypto from "crypto";

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

//是否支持断点
export const supportsResume = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Range: "bytes=0-0",
    },
  });

  return res.status === 206;
};

//获取md5
export const getFileMD5 = (path: string) => {
  const buffer = fs.readFileSync(path);
  const hash = crypto.createHash("md5");
  hash.update(buffer);
  return hash.digest("hex");
};
