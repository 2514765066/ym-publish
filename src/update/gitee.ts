import { formatVersion } from "../utils";
import { UpdateOtion, UpdateConfig, UpdateInfo } from "../type";

//检查更新
const checkUpdate = async (api: string, appVersion: string) => {
  const response = await fetch(`${api}/latest`);

  if (response.status != 200) {
    return false;
  }

  const updateInfo: UpdateInfo = await response.json();

  //找到对应的配置信息
  const latestConfig = updateInfo.assets.find(
    item => item.name == "latest.json"
  );

  //没有配置
  if (!latestConfig) {
    return false;
  }

  const res = await fetch(latestConfig.browser_download_url);

  const { md5, version, name }: UpdateConfig = await res.json();

  //不需要更新
  if (formatVersion(appVersion) >= formatVersion(version)) {
    return false;
  }

  //找到对应的安装包
  const info = updateInfo.assets.find(item => item.name == name);

  //没有安装包
  if (!info) {
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
