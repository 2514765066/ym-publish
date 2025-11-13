import { basename } from "path";
import { getFileMD5 } from "../utils";

interface GetLatestFileOption {
  path: string;
  version: string;
}

//获取latest.json
export const getLatest = ({ path, version }: GetLatestFileOption) => {
  const md5 = getFileMD5(path);

  const name = basename(path);

  const res = {
    md5,
    version,
    name,
  };

  return new File([JSON.stringify(res)], "latest.json");
};
