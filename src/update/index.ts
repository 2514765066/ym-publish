import { createWriteStream, existsSync } from "fs";
import Stream from "stream";
import { spawn } from "child_process";
import { UpdateConfig, UpdateInfo } from "../type";
import { formatVersion } from "../utils";
import { unlink } from "fs/promises";

/**
 * 检查更新
 * @param url 获取最新更新的url地址
 * @param appVersion 当前版本
 * @returns
 */
export const checkUpdate = async (url: string, appVersion: string) => {
  const response = await fetch(url);

  if (response.status != 200) {
    console.error("源地址无法访问", url);

    return false;
  }

  const updateInfo: UpdateInfo = await response.json();

  //找到对应的配置信息
  const latestConfig = updateInfo.assets.find(
    item => item.name == "latest.json"
  );

  //没有配置
  if (!latestConfig) {
    console.error("没有找到latest.json文件");

    return false;
  }

  const res = await fetch(latestConfig.browser_download_url);

  const { md5, version, name }: UpdateConfig = await res.json();

  //不需要更新
  if (formatVersion(appVersion) >= formatVersion(version)) {
    console.log("不需要更新");

    return false;
  }

  //找到对应的安装包
  const info = updateInfo.assets.find(item => item.name == name);

  //没有安装包
  if (!info) {
    console.error("没有找到对应的安装包", name);

    return false;
  }

  return {
    version,
    url: info.browser_download_url,
    md5,
  };
};

/**
 * 下载更新
 * @param url 下载更新的url
 * @param filePath 下载位置
 * @param onProgress 进度回调函数
 * @returns
 */
export const downloadUpdate = async (
  url: string,
  downloadPath: string,
  onProgress?: (percent: number) => void
) => {
  const response = await fetch(url);

  if (!response.ok) {
    return false;
  }

  const total = Number(response.headers.get("content-length") ?? 0);

  if (existsSync(downloadPath)) {
    await unlink(downloadPath);
  }

  const fileStream = createWriteStream(downloadPath);

  //@ts-ignore
  const nodeStream = Stream.Readable.fromWeb(response.body);

  let downloaded = 0;

  return await new Promise(resolve => {
    if (onProgress) {
      nodeStream.on("data", chunk => {
        downloaded += chunk.length;

        if (total > 0 && onProgress) {
          const percent = Number(((downloaded / total) * 100).toFixed(2));
          onProgress(percent);
        }
      });
    }

    nodeStream.pipe(fileStream);

    fileStream.on("error", () => resolve(false));

    fileStream.on("finish", () => fileStream.close());

    fileStream.on("close", async () => {
      await new Promise(r => setTimeout(r, 50));

      resolve(true);
    });
  });
};

/**
 * 安装更新
 * @param installerPath 下载位置
 * @param silent 是否静默安装
 */
export const installUpdate = (installerPath: string, silent?: boolean) => {
  const args = [];

  if (silent) {
    args.push("/S");
  }

  const child = spawn(installerPath, args, {
    detached: true,
    stdio: "ignore",
  });

  child.unref();
};
