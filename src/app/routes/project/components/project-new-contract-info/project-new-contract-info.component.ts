import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { ProjectService } from '../../services';
import { ContractType } from '@shared';

@Component({
  selector: 'app-project-new-contract-info',
  templateUrl: './project-new-contract-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNewContractInfoComponent implements OnInit {
  form: FormGroup;
  // 合同类型数组
  contractTypes$: Observable<ContractType[]>;
  // 表单页面日期格式
  dateFormat = 'yyyy/MM/dd';

  constructor(private fb: FormBuilder, private service: ProjectService) {}

  ngOnInit() {
    this.form = this.fb.group({
      contractIDHD: [null],
      contractIDYZ: [null],
      contractName: [null],
      proprietorName: [null],
      projectDateRange: [null],
      contractDate: [null],
      warranty: [null],
      projectContent: [null],
      contractType: [null],
      linkmanNameSW: [null],
      linkmanPhoneSW: [null],
      linkmanNameJS: [null],
      linkmanPhoneJS: [null],
      projectAddress: [null],
      proprietorAddress: [null],
    });
    this.contractTypes$ = this.service.getContractTypes();
  }

  //#region get form fields

  get contractIDHD() {
    return this.form.controls.contractIDHD;
  }
  get contractIDYZ() {
    return this.form.controls.contractIDYZ;
  }
  get contractName() {
    return this.form.controls.contractName;
  }
  get proprietorName() {
    return this.form.controls.proprietorName;
  }
  get projectDateRange() {
    return this.form.controls.projectDateRange;
  }
  get contractDate() {
    return this.form.controls.contractDate;
  }
  get warranty() {
    return this.form.controls.warranty;
  }
  get projectContent() {
    return this.form.controls.projectContent;
  }
  get contractType() {
    return this.form.controls.contractType;
  }
  get linkmanNameSW() {
    return this.form.controls.linkmanNameSW;
  }
  get linkmanPhoneSW() {
    return this.form.controls.linkmanPhoneSW;
  }
  get linkmanNameJS() {
    return this.form.controls.linkmanNameJS;
  }
  get linkmanPhoneJS() {
    return this.form.controls.linkmanPhoneJS;
  }
  get projectAddress() {
    return this.form.controls.projectAddress;
  }
  get proprietorAddress() {
    return this.form.controls.proprietorAddress;
  }
  //#endregion

  // 防止按下回车表单提交
  formKeyDownFunction(event) {
    if (event.keyCode == 13) {
      // alert('you just clicked enter');
      // rest of your code
      return false;
    }
  }

  _submitForm() {
    // 对话框没有销毁
    // 验证上传文件重名、导入文件重名、文件没有上传完不可以提交
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
    if (this.form.invalid) {
      return;
    }
  }
}
