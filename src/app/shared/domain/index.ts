import { UploadFile } from 'ng-zorro-antd/upload';

// 立项提交参数
export interface ProjectFormValue {
  // 立项步骤0，基础信息数据
  basicInfo: {
    projectName: string;
    initRoot: ProjectRoot;
    projectProperty: string;
    projectRelevance: Project;
    projectManager: User;
    projectMembers: User[];
    initDate: Date;
  };
  // 立项步骤1，合同信息数据
  contractInfo: {
    contractIDHD: string;
    contractIDJF: string;
    contractName: string;
    partyAName: string;
    projectDateRange: [Date, Date];
    contractDate: Date;
    warranty: string;
    projectContent: string;
    contractType: ContractType;
    partyALinkmanName: string;
    partyALinkmanPhone: string;
    projectAddress: string;
    partyAAddress: string;
  };
  // 立项步骤2，管理信息数据
  manageInfo: {
    linkmenInfo: Array<{
      linkmanName: string;
      linkmanType: LinkmanType;
      linkmanCompanyName: string;
      linkmanDuty: string;
      linkmanCellphone: string;
      linkmanPhone: string;
      linkmanQQ: string;
      linkmanWeChat: string;
      linkmanEmail: string;
    }>;
  };
  // 立项步骤3，分包信息数据
  subcontractInfo: Array<{ subcontractName: string; subcontractSum: string; subcontractDetails: string }>;
  // 立项步骤4，项目资料数据
  dataInfo: {
    rootDir: string;
    technologyAgreementDir: string;
    technologySchemeDir: string;
    budgetDir: string;
    settlementDir: string;
    productionSchedulingNoticeDir: string;
    uploadFileLists: Array<UploadFile[]>;
  };
}
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
export interface LinkmanType {
  id: number;
  name: string;
}
// 联系人类型
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
