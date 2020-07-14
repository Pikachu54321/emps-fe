import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { Observable, Observer } from 'rxjs';
import { ProjectService, ProjectStepService } from '../../services';
import { ContractType } from '@shared';

@Component({
  selector: 'app-project-new-contract-info',
  templateUrl: './project-new-contract-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNewContractInfoComponent implements OnInit {
  // 输入框尺寸设置
  @Input() inputSize: NzSelectSizeType;
  form: FormGroup;

  constructor(private fb: FormBuilder, private service: ProjectService, public projectStepService: ProjectStepService) {}

  ngOnInit() {
    // proprietorName
    this.form = this.fb.group({
      contractIDHD: [null],
      contractIDYZ: [null],
      contractName: [null],
      partyAName: [null],
      projectDateRange: [null],
      contractDate: [null],
      warranty: [null],
      projectContent: [null],
      contractType: [null],
      partyALinkmanName: [null],
      partyALinkmanPhone: [null],
      projectAddress: [null],
      partyAAddress: [null],
    });
    this.service.getContractTypes().subscribe((res: any) => {
      this.projectStepService.contractTypes = res.data.contractTypes;
      this.form.patchValue(this.projectStepService);
    });
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
  get partyAName() {
    return this.form.controls.partyAName;
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
  get partyALinkmanName() {
    return this.form.controls.partyALinkmanName;
  }
  get partyALinkmanPhone() {
    return this.form.controls.partyALinkmanPhone;
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
  // 上一步
  prev() {
    // 如果验证成功
    if (this.verificationSave()) {
      --this.projectStepService.step;
    }
  }
  _submitForm() {
    // 如果验证成功
    if (this.verificationSave()) {
      ++this.projectStepService.step;
    }
  }
  verificationSave(): boolean {
    // 验证上传文件重名、导入文件重名、文件没有上传完不可以提交
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
    if (this.form.invalid) {
      return false;
    } else {
      Object.assign(this.projectStepService, this.form.value);
      return true;
    }
  }
}
