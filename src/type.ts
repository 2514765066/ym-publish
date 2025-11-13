export interface ReleasesOption {
  //用户token
  token: string;

  //仓库名称
  repo: string;

  //用户名
  owner: string;
}

export interface Base {
  //版本
  version: string;

  //标签名
  tag?: string;

  //标题名
  name?: string;

  //使用哪个分支
  commitish?: string;

  //内容
  body: string;
}

export type PublishOption = Base & {
  //文件
  filepaths: (string | File)[];
};

export type CreateReleaseOption = Base & {
  //token
  token: string;
};

export interface UploadAssetsOption {
  //token
  token: string;

  //文件路径
  filepaths: (string | File)[];
}

export interface UpdateOtion {
  //仓库名称
  repo: string;

  //用户名
  owner: string;
}

export interface UpdateInfo {
  assets: {
    browser_download_url: string;
    name: string;
  }[];
  name: string;
  tag_name: string;
}

export interface UpdateConfig {
  md5: string;
  version: string;
  name: string;
}
