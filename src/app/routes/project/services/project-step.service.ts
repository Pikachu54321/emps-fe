import { Injectable } from '@angular/core';
import { ProjectRoot, User, Project, ContractType } from '@shared';

@Injectable()
export class ProjectStepService {
  step: 0 | 1 | 2 | 3 | 4 = 0;
  stepTitles: string[] = ['项目基础信息', '合同信息（选填）', '项目管理信息（选填）', '分包信息（选填）', '项目资料信息（选填）'];
  // 表单页面日期格式
  dateFormat: string = 'yyyy-MM-dd';

  // 步骤1参数
  // 立项依据数组
  projectRoots: ProjectRoot[] = null;
  // 用户数组
  users: User[] = null;
  // 主项目数组
  parentProjects: Project[] = null;
  // 关联项目下拉菜单是否禁用。项目属性为主项目或未选择时禁用
  projectRelevanceDisabled: boolean = true;

  // 步骤1要提交后台数据
  projectName: string;
  initRoot: string;
  projectProperty: string;
  projectRelevance: string;
  projectManager: string;
  projectMembers: string[];
  initDate: string;

  // 步骤2参数
  // 合同类型数组
  contractTypes: ContractType[];

  // 步骤2要提交后台数据
  contractIDHD: string;
  contractIDYZ: string;
  contractName: string;
  partyAName: string;
  projectDateRange: [Date, Date];
  contractDate: string;
  warranty: string;
  projectContent: string;
  contractType: string;
  partyALinkmanName: string;
  partyALinkmanPhone: string;
  projectAddress: string;
  partyAAddress: string;
  constructor() {}
}
