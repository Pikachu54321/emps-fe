import { ChangeDetectionStrategy, Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { ProjectService, ProjectStepService } from '../../services';
import { ContractType, ProjectFormValue } from '@shared';

@Component({
  selector: 'app-project-new-confirmation-info',
  templateUrl: './project-new-confirmation-info.component.html',
  styleUrls: ['./project-new-confirmation-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNewConfirmationInfoComponent implements OnInit {
  // 输入框尺寸设置
  @Input() inputSize: NzSelectSizeType;

  // 步骤1
  // 立项依据名
  initRootName: string;
  // 项目经理名
  projectManagerName: string;
  // 项目成员名数组
  projectMembers: string[] = [];
  // 项目关联主项目名
  projectRelevanceName: string;
  // 步骤2
  // 合同类型名
  contractTypeName: string;
  // 工期字符串数组
  projectDateRangeString: string[] = [];

  constructor(
    private service: ProjectService,
    public projectStepService: ProjectStepService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    // 项目成员对象数组转换为成员名数组，为了显示
    if (this.projectStepService.projectMembers) {
      this.projectMembers = this.projectStepService.projectMembers.map((item) => item.name);
    }

    // // 合同类型从id到值转换为了显示
    // if (this.projectStepService.contractType) {
    //   this.projectStepService.contractTypes.forEach((contractType) => {
    //     if (contractType.id + '' === this.projectStepService.contractType) {
    //       this.contractTypeName = contractType.name;
    //     }
    //   });
    // }
    // 处理工期数组，转换成能显示的字符串
    if (this.projectDateRangeString) {
      // this.projectDateRangeString[0]=this.projectStepService.projectDateRange[0];
    }
  }

  //#region get form fields

  //#endregion

  // 防止按下回车表单提交
  formKeyDownFunction(event) {
    if (event.keyCode == 13) {
      // alert('you just clicked enter');
      // rest of your code
      return false;
    }
  }
  // 跳转回表单页
  stepEditJump(index: 0 | 1 | 2 | 3 | 4 | 5) {
    this.projectStepService.step = index;
  }
  // 上一步
  prev() {
    // this.verificationSave();
    --this.projectStepService.step;
  }
  submitForm() {
    // 提交按钮禁用disabled
    this.projectStepService.submitButtonIsLoading = true;
    // 整理上传路径对象
    // 添加projectNewFilePaths根目录绝对路径
    this.projectStepService.projectNewFilePaths[0].absolutePath = this.projectStepService.uploadPath[
      this.projectStepService.projectNewFilePaths[0].key
    ];
    // 添加projectNewFilePaths子目录绝对路径
    for (let i = 0; i < this.projectStepService.projectNewFilePaths[0].children.length; i++) {
      this.projectStepService.projectNewFilePaths[0].children[i].absolutePath = this.projectStepService.uploadPath[
        this.projectStepService.projectNewFilePaths[0].children[i].key
      ];
    }
    // 要提交的数据
    let formValue: ProjectFormValue = {
      basicInfo: {
        projectName: this.projectStepService.projectName,
        initRoot: this.projectStepService.initRoot,
        initRootDate: this.projectStepService.initRootDate,
        initRootMessage: this.projectStepService.initRootMessage,
        projectProperty: this.projectStepService.projectProperty,
        projectRelevance: this.projectStepService.projectRelevance,
        projectManager: this.projectStepService.projectManager,
        projectMembers: this.projectStepService.projectMembers,
        initDate: new Date(),
      },
      contractInfo: {
        contractIDHD: this.projectStepService.contractIDHD,
        contractIDJF: this.projectStepService.contractIDJF,
        contractName: this.projectStepService.contractName,
        partyAName: this.projectStepService.partyAName,
        projectDateRange: this.projectStepService.projectDateRange,
        contractDate: this.projectStepService.contractDate,
        warranty: this.projectStepService.warranty,
        projectContent: this.projectStepService.projectContent,
        contractType: this.projectStepService.contractType,
        partyALinkmanName: this.projectStepService.partyAName,
        partyALinkmanPhone: this.projectStepService.partyALinkmanPhone,
        projectAddress: this.projectStepService.projectAddress,
        partyAAddress: this.projectStepService.partyAAddress,
      },
      manageInfo: {
        linkmenInfo: this.projectStepService.linkmenInfo,
      },
      subcontractInfo: this.projectStepService.subcontractInfo,
      dataInfo: {
        uploadPath: this.projectStepService.projectNewFilePaths[0],
        uploadFileLists: this.projectStepService.uploadFileLists,
      },
    };
    // 提交表单
    this.service.postNewProject(formValue).subscribe((res: any) => {
      // 提交按钮取消loading状态
      this.projectStepService.submitButtonIsLoading = false;
      this.cdr.markForCheck();
      // 如果有错误返回
      if (res.msg !== 'ok') {
        return;
      }
      // 如果成功，展示结果页
      this.projectStepService.isShowResult = true;
    });
  }
}
