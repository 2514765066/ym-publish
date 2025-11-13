import { formatVersion } from "../utils";
import { UpdateOtion, UpdateConfig, UpdateInfo } from "../type";

//检查更新
const checkUpdate = async (api: string, appVersion: string) => {
  const url = `${api}/latest`;

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

export const useGiteeUpdate = ({ repo, owner }: UpdateOtion) => {
  const Api = `https://gitee.com/api/v5/repos/${owner}/${repo}/releases`;

  return checkUpdate.bind(null, Api);
};
