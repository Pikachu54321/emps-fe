import { Injectable } from '@angular/core';

@Injectable()
export class ProjectStepService {
  step: 0 | 1 | 2 = 0;

  // 步骤1要提交后台数据
  projectName: string;
  initRoot: string;
  projectProperty: string;
  projectRelevance: string;
  projectManager: string;
  initDate: string;

  constructor() {}
}
