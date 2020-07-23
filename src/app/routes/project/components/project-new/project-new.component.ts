import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { ProjectService, ProjectStepService } from '../../services';

import { DatePipe } from '@angular/common';
import { ProjectNewBasicInfoComponent } from '../project-new-basic-info';
import { ProjectNewContractInfoComponent } from '../project-new-contract-info';
import { ProjectNewManageInfoComponent } from '../project-new-manage-info';
import { ProjectNewSubcontractInfoComponent } from '../project-new-subcontract-info';
import { ProjectNewDataInfoComponent } from '../project-new-data-info';

@Component({
  selector: 'app-project-new',
  templateUrl: './project-new.component.html',
  styleUrls: ['./project-new.component.less'],
  providers: [ProjectStepService, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNewComponent implements OnInit {
  // 输入框尺寸
  inputSize: NzSelectSizeType = 'large';

  constructor(
    private service: ProjectService,

    private datePipe: DatePipe,
    public projectStepService: ProjectStepService,
  ) {
    // this.initDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    // let a = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    // console.log(a);
  }

  ngOnInit() {
    console.log(this.datePipe.transform(new Date()));

    // 读取项目主项目
    // this.service.getParentProjects().subscribe((res: any) => {
    //   this.projectStepService.parentProjects = res.data.parentProjects;
    // });
    // 读取项目立项路径配置参数
    this.service.getProjectNewPathParameter().subscribe((res: any) => {
      this.projectStepService.projectNewFilePaths = res.data.projectNewFilePaths;
      // 设置上传路径对象的根目录参数
      this.projectStepService.uploadPath[this.projectStepService.projectNewFilePaths[0].key] = null;
      // 设定有几个上传文件列表 new Array<UploadFile[]>(this.projectNewFilePaths[0].children.length)
      for (let index = 0; index < this.projectStepService.projectNewFilePaths[0].children.length; index++) {
        // 设置上传路径对象的子目录参数
        this.projectStepService.uploadPath[this.projectStepService.projectNewFilePaths[0].children[index].key] = null;
        this.projectStepService.uploadFileLists[index] = [];
      }
    });
  }
  // 步骤0-4组件对象
  @ViewChild(ProjectNewBasicInfoComponent) projectNewBasicInfoComponent!: ProjectNewBasicInfoComponent;
  @ViewChild(ProjectNewContractInfoComponent) projectNewContractInfoComponent!: ProjectNewContractInfoComponent;
  @ViewChild(ProjectNewManageInfoComponent) projectNewManageInfoComponent!: ProjectNewManageInfoComponent;
  @ViewChild(ProjectNewSubcontractInfoComponent) projectNewSubcontractInfoComponent!: ProjectNewSubcontractInfoComponent;
  @ViewChild(ProjectNewDataInfoComponent) projectNewDataInfoComponent!: ProjectNewDataInfoComponent;
  // 点击单个步骤时触发的事件
  onStepIndexChange(index: 0 | 1 | 2 | 3 | 4 | 5): void {
    if (this.projectStepService.step === 0) {
      // 如果验证成功
      if (this.projectNewBasicInfoComponent.verificationSave()) {
        this.projectStepService.step = index;
      }
    } else if (this.projectStepService.step === 1) {
      // 如果验证成功
      if (this.projectNewContractInfoComponent.verificationSave()) {
        this.projectStepService.step = index;
      }
    } else if (this.projectStepService.step === 2) {
      // // 如果验证成功
      // if (this.projectNewManageInfoComponent.verificationSave()) {

      // }
      this.projectStepService.step = index;
    } else if (this.projectStepService.step === 3) {
      // 如果验证成功
      if (this.projectNewSubcontractInfoComponent.verificationSave()) {
        this.projectStepService.step = index;
      }
    } else if (this.projectStepService.step === 4) {
      // 如果验证成功，且不在上传中状态
      if (this.projectNewDataInfoComponent.verificationSave() && this.projectStepService.uploadStatus !== 'uploading') {
        this.projectStepService.step = index;
      }
    } else if (this.projectStepService.step === 5) {
      this.projectStepService.step = index;
    }
  }

  //#region get form fields

  //#endregion
}
