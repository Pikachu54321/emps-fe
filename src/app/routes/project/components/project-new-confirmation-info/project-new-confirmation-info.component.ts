import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { Observable, Observer } from 'rxjs';
import { ProjectService, ProjectStepService } from '../../services';
import { ContractType } from '@shared';

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

  constructor(private fb: FormBuilder, private service: ProjectService, public projectStepService: ProjectStepService) {}

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
  // 上一步
  prev() {
    // this.verificationSave();
    --this.projectStepService.step;
  }
  _submitForm() {
    // this.verificationSave();
    ++this.projectStepService.step;
  }

  // verificationSave() {
  //   // 验证上传文件重名、导入文件重名、文件没有上传完不可以提交
  //   Object.keys(this.form.controls).forEach((key) => {
  //     this.form.controls[key].markAsDirty();
  //     this.form.controls[key].updateValueAndValidity();
  //   });
  //   if (this.form.invalid) {
  //     return;
  //   } else {
  //     Object.assign(this.projectStepService, this.form.value);
  //   }
  // }
}
