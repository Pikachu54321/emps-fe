import { Injectable } from '@angular/core';
import { UploadFile, UploadFileStatus } from 'ng-zorro-antd/upload';
import { ProjectRoot, User, Project, ContractType, ProjectNewFilePath, LinkmanType } from '@shared';
import { ProjectService } from './project.service';

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
  initRoot: ProjectRoot = null;
  initRootDate: Date = null;
  initRootMessage: string = null;
  projectProperty: string = null;
  projectRelevance: Project = null;
  projectManager: User = null;
  projectMembers: User[] = null;
  initDate: string = null;

  // 步骤1参数
  // 合同类型数组
  contractTypes: ContractType[] = null;

  // 步骤1要提交后台数据
  contractIDHD: string = null;
  contractIDJF: string = null;
  contractName: string = null;
  partyAName: string = null;
  projectDateRange: [Date, Date] = null;
  contractDate: Date = null;
  warranty: string = null;
  projectContent: string = null;
  contractType: ContractType = null;
  partyALinkmanName: string = null;
  partyALinkmanPhone: string = null;
  projectAddress: string = null;
  partyAAddress: string = null;

  // 步骤2参数
  // 联系人类型数组
  linkmanTypes: LinkmanType[] = null;
  // 步骤2要提交后台数据
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
  subcontractInfo: Array<{ subcontractName: string; subcontractSum: string; subcontractDetails: string }> = [];

  // 步骤4参数
  // 提交按钮是否loading
  submitButtonIsLoading: boolean = false;
  // 项目立项路径配置参数
  projectNewFilePaths: ProjectNewFilePath[] = null;
  // 上传文件的列表的列表，总表
  uploadFileLists: Array<UploadFile[]> = [];
  // 上传状态
  uploadStatus: UploadFileStatus = null;
  // 步骤4要提交后台数据

  uploadPath: {} = {};

  // rootDir: string = null;
  // technologyAgreementDir: string = null;
  // technologySchemeDir: string = null;
  // budgetDir: string = null;
  // settlementDir: string = null;
  // productionSchedulingNoticeDir: string = null;

  // 是否展示结果页
  isShowResult: boolean = false;
  constructor(private service: ProjectService) {}

  // 再次立项
  again() {
    this.step = 0;
    // 步骤0参数
    this.projectRoots = null;
    // 用户数组
    this.users = null;
    // 主项目数组
    this.parentProjects = null;
    // 关联项目下拉菜单是否禁用。项目属性为主项目或未选择时禁用
    this.projectRelevanceDisabled = true;
    // 步骤0要提交后台数据
    this.projectName = null;
    this.initRoot = null;
    this.initRootDate = null;
    this.initRootMessage = null;
    this.projectProperty = null;
    this.projectRelevance = null;
    this.projectManager = null;
    this.projectMembers = null;
    this.initDate = null;
    // 步骤1参数
    // 合同类型数组
    this.contractTypes = null;

    // 步骤1要提交后台数据
    this.contractIDHD = null;
    this.contractIDJF = null;
    this.contractName = null;
    this.partyAName = null;
    this.projectDateRange = null;
    this.contractDate = null;
    this.warranty = null;
    this.projectContent = null;
    this.contractType = null;
    this.partyALinkmanName = null;
    this.partyALinkmanPhone = null;
    this.projectAddress = null;
    this.partyAAddress = null;
    // 步骤2参数
    // 联系人类型数组
    this.linkmanTypes = null;
    // 步骤2要提交后台数据
    // 联系人信息
    this.linkmenInfo = [];

    // 步骤3要提交后台数据
    this.subcontractInfo = [];

    // 步骤4参数
    // 提交按钮是否disabled
    this.submitButtonIsLoading = false;
    // 项目立项路径配置参数
    // this.projectNewFilePaths = null;
    // 上传文件的列表的列表，总表
    // this.uploadFileLists = [];
    // 上传状态
    this.uploadStatus = null;
    // 步骤4要提交后台数据

    // this.uploadPath = {};
    // 是否展示结果页
    this.isShowResult = false;

    // 读取项目立项路径配置参数
    this.service.getProjectNewPathParameter().subscribe((res: any) => {
      this.projectNewFilePaths = res.data.projectNewFilePaths;
      // 设置上传路径对象的根目录参数
      this.uploadPath[this.projectNewFilePaths[0].key] = null;
      // 设定有几个上传文件列表 new Array<UploadFile[]>(this.projectNewFilePaths[0].children.length)
      for (let index = 0; index < this.projectNewFilePaths[0].children.length; index++) {
        // 设置上传路径对象的子目录参数
        this.uploadPath[this.projectNewFilePaths[0].children[index].key] = null;
        this.uploadFileLists[index] = [];
      }
    });
  }
}
