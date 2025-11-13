import { getFile } from "../utils";
import {
  CreateReleaseOption,
  PublishOption,
  ReleasesOption,
  UploadAssetsOption,
} from "../type";
import { existsSync } from "fs";

// 创建 Release
const createRelease = async (url: string, option: CreateReleaseOption) => {
  const payload = {
    tag_name: option.tag || `v${option.version}`,
    target_commitish: option.commitish ?? "main",
    name: option.name || option.version,
    body: option.body,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `token ${option.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const e = await response.json();

    throw new Error(`创建 Release 失败: ${e.message}`);
  }

  const data = await response.json();

  return data.upload_url.replace("{?name,label}", "");
};

// 上传文件
const uploadAssets = async (url: string, option: UploadAssetsOption) => {
  const uploadAsset = async (file: File) => {
    const response = await fetch(`${url}?name=${file.name}`, {
      method: "POST",
      headers: {
        Authorization: `token ${option.token}`,
        "Content-Type": "application/octet-stream",
      },
      body: file,
    });

    if (!response.ok) {
      const e = await response.text();

      throw new Error(`文件上传失败: ${e}`);
    }
  };

  const handleUpload = async (filepath: File) => {
    try {
      await uploadAsset(filepath);
      console.log(`上传成功: ${filepath.name}`);
    } catch (e) {
      console.error(`文件上传失败: ${filepath.name} \r\n原因: ${e}`);
    }
  };

  for (const filepath of option.filepaths) {
    //是一个文件
    if (filepath instanceof File) {
      await handleUpload(filepath);
      continue;
    }

    //路径不存在
    if (!existsSync(filepath)) {
      console.error(`文件不存在: ${filepath}`);
      continue;
    }

    //读取文件
    const file = getFile(filepath);

    await handleUpload(file);
  }
};

export const useGithubReleases = ({ token, repo, owner }: ReleasesOption) => {
  const Api = `https://api.github.com/repos/${owner}/${repo}/releases`;

  return async (option: PublishOption) => {
    console.log("开始Github发布");

    const uploadApi = await createRelease(Api, {
      token,
      ...option,
    });

    console.log(`Release 创建成功`);

    console.log("上传文件...");

    await uploadAssets(uploadApi, {
      token,
      filepaths: option.filepaths,
    });

    console.log("Github发布成功");
  };
};
