import { Injectable } from '@angular/core';

@Injectable()
export class ProjectStepService {
  step: 0 | 1 | 2 | 3 | 4 = 0;
  stepTitles: string[] = ['项目基础信息', '合同信息（选填）', '联系人信息（选填）', '分包信息（选填）', '项目资料信息（选填）'];

  // 步骤1要提交后台数据
  projectName: string;
  initRoot: string;
  projectProperty: string;
  projectRelevance: string;
  projectManager: string;
  projectMembers: string[];
  initDate: string;

  constructor() {}
}
