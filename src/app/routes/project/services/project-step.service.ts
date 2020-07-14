import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { UploadFile, UploadFileStatus } from 'ng-zorro-antd/upload';
import { ProjectRoot, User, Project, ContractType, ProjectNewFilePath, LinkmanType } from '@shared';

@Injectable()
export class ProjectStepService {
  step: 0 | 1 | 2 | 3 | 4 | 5 = 0;
  stepTitles: string[] = ['基础信息', '合同信息(选填)', '管理信息(选填)', '分包信息(选填)', '项目资料(选填)', '确认信息'];
  // 表单页面日期格式
  dateFormat: string = 'yyyy-MM-dd';

  // 步骤0参数
  // 立项依据数组
  projectRoots: ProjectRoot[] = null;
  // 用户数组
  users: User[] = null;
  // 主项目数组
  parentProjects: Project[] = null;
  // 关联项目下拉菜单是否禁用。项目属性为主项目或未选择时禁用
  projectRelevanceDisabled: boolean = true;

  // 步骤0要提交后台数据
  projectName: string = null;
  initRoot: string = null;
  projectProperty: string = null;
  projectRelevance: string = null;
  projectManager: string = null;
  projectMembers: string[] = null;
  initDate: string = null;

  // 步骤1参数
  // 合同类型数组
  contractTypes: ContractType[] = null;

  // 步骤1要提交后台数据
  contractIDHD: string = null;
  contractIDYZ: string = null;
  contractName: string = null;
  partyAName: string = null;
  projectDateRange: [Date, Date] = null;
  contractDate: Date = null;
  warranty: string = null;
  projectContent: string = null;
  contractType: string = null;
  partyALinkmanName: string = null;
  partyALinkmanPhone: string = null;
  projectAddress: string = null;
  partyAAddress: string = null;

  // 步骤2要提交后台数据
  linkmanTypes: LinkmanType[] = null;
  // 联系人信息
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
  }> = [];

  // 步骤3要提交后台数据
  subcontractInfo: Array<{ subcontractName: string; subcontractSum: string; subcontractDetails: string }> = null;

  // 步骤4参数
  // 项目立项路径配置参数
  projectNewFilePaths: ProjectNewFilePath[] = null;
  // 上传文件的列表的列表，总表
  uploadFileLists: Array<UploadFile[]> = [];
  // 上传状态
  uploadStatus: UploadFileStatus;
  // 步骤4要提交后台数据
  rootDir: string;
  technologyAgreementDir: string;
  technologySchemeDir: string;
  budgetDir: string;
  settlementDir: string;
  productionSchedulingNoticeDir: string;
  constructor() {}
}
