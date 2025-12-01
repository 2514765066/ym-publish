import { getFile } from "../utils";
import {
  CreateReleaseOption,
  PublishOption,
  ReleasesOption,
  UploadAssetsOption,
} from "../type";
import { existsSync } from "fs";
import { getLatest } from ".";

//创建 Release
const createRelease = async (url: string, option: CreateReleaseOption) => {
  const form = new FormData();

  form.append("access_token", option.token);
  form.append("tag_name", option.tag || `v${option.version}`);
  form.append("name", option.name || option.version);
  form.append("target_commitish", option.commitish || "main");
  form.append("body", option.body);

  const response = await fetch(url, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    const e = await response.json();

    throw new Error(`创建 Release 失败: ${e.message}`);
  }

  const data = await response.json();

  return data.id as string;
};

//上传文件
const uploadAssets = async (url: string, option: UploadAssetsOption) => {
  const uploadAsset = async (file: File) => {
    const form = new FormData();

    form.append("access_token", option.token);

    form.append("file", file);

    const response = await fetch(url, {
      method: "POST",
      body: form,
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

export const useGiteeReleases = ({ token, repo, owner }: ReleasesOption) => {
  const Api = `https://gitee.com/api/v5/repos/${owner}/${repo}/releases`;

  return async (option: PublishOption) => {
    const { updatePack, version, files = [] } = option;

    console.log("开始Gitee发布");

    const id = await createRelease(Api, {
      token,
      ...option,
    });

    console.log(`Release 创建成功`);

    console.log("上传文件...");

    const uploadApi = `${Api}/${id}/attach_files`;

    const latestInfo = getLatest({
      path: updatePack,
      version: version,
    });

    await uploadAssets(uploadApi, {
      token,
      filepaths: [latestInfo, updatePack, ...files],
    });

    console.log("Gitee发布成功");
  };
};
