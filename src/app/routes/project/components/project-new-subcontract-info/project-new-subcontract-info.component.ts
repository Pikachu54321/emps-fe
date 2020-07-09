import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { Observable, Observer } from 'rxjs';
import { ProjectService, ProjectStepService } from '../../services';
import { ContractType } from '@shared';

@Component({
  selector: 'app-project-new-subcontract-info',
  templateUrl: './project-new-subcontract-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNewSubcontractInfoComponent implements OnInit {
  // 输入框尺寸设置
  @Input() inputSize: NzSelectSizeType;
  form: FormGroup;

  constructor(private fb: FormBuilder, private service: ProjectService, public projectStepService: ProjectStepService) {}

  ngOnInit() {
    this.form = this.fb.group({
      subcontractInfo: this.fb.array([]),
    });
    // this.service.getContractTypes().subscribe((res: any) => {
    //   this.projectStepService.contractTypes = res.data.contractTypes;
    //   this.form.patchValue(this.projectStepService);
    // });
    // this.form.patchValue(this.projectStepService);

    if (this.projectStepService.subcontractInfo) {
      for (let index = 0; index < this.projectStepService.subcontractInfo?.length; index++) {
        this.subcontractInfo.push(this.createSubcontract());
      }
      this.form.patchValue(this.projectStepService);
    }
  }

  //#region get form fields

  get subcontractInfo() {
    return this.form.controls.subcontractInfo as FormArray;
  }
  //#endregion

  // 防止按下回车表单提交
  formKeyDownFunction(event) {
    if (event.keyCode == 13) {
      return false;
    }
  }

  subcontractEditIndex: number = -1;
  subcontractEditObj = {};

  createSubcontract(): FormGroup {
    return this.fb.group({
      subcontractName: [null],
      subcontractSum: [null],
      subcontractDetails: [null],
    });
  }
  addSubcontract() {
    this.subcontractInfo.push(this.createSubcontract());
    this.editSubcontract(this.subcontractInfo.length - 1);
  }

  delSubcontract(index: number) {
    // 表示有条目在编辑状态
    if (this.subcontractEditIndex !== -1) {
      // 如果删除条目索引小于当前编辑条目索引，当前编辑条目索引-1
      if (index < this.subcontractEditIndex) {
        this.subcontractEditIndex -= 1;
      }
    }
    this.subcontractInfo.removeAt(index);
  }

  editSubcontract(index: number) {
    if (this.subcontractEditIndex !== -1 && this.subcontractEditObj) {
      this.subcontractInfo.at(this.subcontractEditIndex).patchValue(this.subcontractEditObj);
    }
    this.subcontractEditObj = { ...this.subcontractInfo.at(index).value };
    this.subcontractEditIndex = index;
  }

  saveSubcontract(index: number) {
    this.subcontractInfo.at(index).markAsDirty();
    if (this.subcontractInfo.at(index).invalid) {
      return;
    }
    this.subcontractEditIndex = -1;
  }

  cancelSubcontract(index: number) {
    if (!this.subcontractInfo.at(index).value.subcontractName) {
      this.delSubcontract(index);
    } else {
      this.subcontractInfo.at(index).patchValue(this.subcontractEditObj);
    }
    this.subcontractEditIndex = -1;
  }
  // 分包合同金额
  subcontractSumValue = '';
  subcontractSumOnBlur(event: string, index: number): void {
    let value = event;
    if (event.charAt(value.length - 1) === '.' || value === '-') {
      this.updateNumValue(value.slice(0, -1), index);
    }
  }
  subcontractSumOnChange(event: InputEvent, index: number): void {
    this.updateNumValue((event.target as HTMLInputElement).value, index);
  }
  updateNumValue(value: string, index: number): void {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]{0,2})?$/;
    if ((!isNaN(+value) && reg.test(value)) || value === '' || value === '-') {
      this.subcontractSumValue = value;
    }
    this.subcontractInfo.at(index).get('subcontractSum').setValue(this.subcontractSumValue);
    // this.rd2.setProperty(this.subcontractSumInput.nativeElement, 'value', this.subcontractSumValue);
  }
  // 上一步
  prev() {
    this.verificationSave();
    --this.projectStepService.step;
  }
  _submitForm() {
    this.verificationSave();
    ++this.projectStepService.step;
  }

  verificationSave() {
    // 验证上传文件重名、导入文件重名、文件没有上传完不可以提交
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
    if (this.form.invalid) {
      return;
    } else {
      Object.assign(this.projectStepService, this.form.value);
    }
  }
}
