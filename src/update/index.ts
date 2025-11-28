import { dirname } from "path";
import { createWriteStream, existsSync } from "fs";
import { mkdir } from "fs/promises";
import Stream from "stream";
import { spawn } from "child_process";

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

  const response = await fetch(url);

  if (!response.ok) {
    return false;
  }

  const total = Number(response.headers.get("content-length") ?? 0);

  const fileStream = createWriteStream(filePath);

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
