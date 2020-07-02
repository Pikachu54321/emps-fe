// 立项依据
export interface ProjectRoot {
  id: number;
  name: string;
}
export interface Project {
  id: number;
  name: string;
}
// user 用户
export interface User {
  id: number;
  name: string;
}
// 合同类型
export interface ContractType {
  id: number;
  name: string;
}

// 新建项目文件路径参数
export interface ProjectNewFilePath {
  text: string;
  path: string;
  key: string;
  children: ProjectNewFileChildPath[];
}
// 新建项目文件子路径参数
export interface ProjectNewFileChildPath {
  text: string;
  path: string;
  key: string;
}
// 文件
export interface FileInfo {
  isDir: number;
  name: string;
  path: string;
  size: string;
  mtime: string;
  superPath: string;
}
// 文件Breadcrumb面包屑
export interface FileBreadcrumbItem {
  name: string;
  path: string;
}
// 文件列表页
export interface FileListPage {
  fileList: FileInfo[];
  sortName: string;
  sortOrder: string;
  FileBreadcrumb: FileBreadcrumbItem[];
}
