import { dirname } from "path";
import { createWriteStream, existsSync, statSync } from "fs";
import { mkdir } from "fs/promises";
import Stream from "stream";
import { spawn } from "child_process";
import { supportsResume } from "../utils";

//下载
export const download = async (
  url: string,
  filePath: string,
  onProgress?: (percent: number) => void
) => {
  const dir = dirname(filePath);

  // 确保目录存在
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  const canResume = await supportsResume(url);

  // 当前已下载文件大小
  let downloadedBytes = 0;

  if (canResume && existsSync(filePath)) {
    downloadedBytes = statSync(filePath).size;
  }

  const response = await fetch(
    url,
    canResume
      ? {
          headers: {
            Range: `bytes=${downloadedBytes}-`,
          },
        }
      : {}
  );

  if (!response.ok) {
    return false;
  }

  const total = Number(response.headers.get("content-length") ?? 0);

  const fileStream = createWriteStream(filePath, {
    flags: downloadedBytes > 0 ? "a" : "w",
  });

  //@ts-ignore
  const nodeStream = Stream.Readable.fromWeb(response.body);

  let downloaded = downloadedBytes;

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

    fileStream.on("finish", () => {
      fileStream.close();
      resolve(true);
    });

    fileStream.on("close", async () => {
      await new Promise(r => setTimeout(r, 50));

      resolve(true);
    });
  });
};

//安装
export const install = (installerPath: string, silent?: boolean) => {
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
