import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { Observable, Observer } from 'rxjs';
import { ProjectService, ProjectStepService } from '../../services';
import { ContractType } from '@shared';

@Component({
  selector: 'app-project-new-manage-info',
  templateUrl: './project-new-manage-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNewManageInfoComponent implements OnInit {
  // 输入框尺寸设置
  @Input() inputSize: NzSelectSizeType;
  form: FormGroup;

  constructor(private fb: FormBuilder, private service: ProjectService, public projectStepService: ProjectStepService) {}

  ngOnInit() {
    // proprietorName
    this.form = this.fb.group({
      partyALinkmanInfo: this.fb.array([]),
      proprietorLinkmanInfo: this.fb.array([]),
    });
    // 如果partyALinkmanInfo不为空，赋值
    if (this.projectStepService.partyALinkmanInfo) {
      for (let index = 0; index < this.projectStepService.partyALinkmanInfo?.length; index++) {
        this.partyALinkmanInfo.push(this.createPartyALinkman());
      }
      this.form.patchValue(this.projectStepService);
    }
    // 如果proprietorLinkmanInfo不为空，赋值
    if (this.projectStepService.proprietorLinkmanInfo) {
      for (let index = 0; index < this.projectStepService.proprietorLinkmanInfo?.length; index++) {
        this.proprietorLinkmanInfo.push(this.createProprietorLinkman());
      }
      this.form.patchValue(this.projectStepService);
    }
  }

  //#region get form fields

  get partyALinkmanInfo() {
    return this.form.controls.partyALinkmanInfo as FormArray;
  }
  get proprietorLinkmanInfo() {
    return this.form.controls.proprietorLinkmanInfo as FormArray;
  }
  // //#endregion

  // // 防止按下回车表单提交
  formKeyDownFunction(event) {
    if (event.keyCode == 13) {
      return false;
    }
  }

  partyALinkmanEditIndex: number = -1;
  partyALinkmanEditObj = {};
  createPartyALinkman(): FormGroup {
    return this.fb.group({
      partyALinkmanName: [null],
      partyALinkmanCellphone: [null],
      partyALinkmanPhone: [null],
    });
  }
  addPartyALinkman() {
    this.partyALinkmanInfo.push(this.createPartyALinkman());
    this.editPartyALinkman(this.partyALinkmanInfo.length - 1);
  }

  delPartyALinkman(index: number) {
    // 表示有条目在编辑状态
    if (this.partyALinkmanEditIndex !== -1) {
      // 如果删除条目索引小于当前编辑条目索引，当前编辑条目索引-1
      if (index < this.partyALinkmanEditIndex) {
        this.partyALinkmanEditIndex -= 1;
      }
    }
    this.partyALinkmanInfo.removeAt(index);
  }

  editPartyALinkman(index: number) {
    if (this.partyALinkmanEditIndex !== -1 && this.partyALinkmanEditObj) {
      this.partyALinkmanInfo.at(this.partyALinkmanEditIndex).patchValue(this.partyALinkmanEditObj);
    }
    this.partyALinkmanEditObj = { ...this.partyALinkmanInfo.at(index).value };
    this.partyALinkmanEditIndex = index;
  }

  savePartyALinkman(index: number) {
    this.partyALinkmanInfo.at(index).markAsDirty();
    if (this.partyALinkmanInfo.at(index).invalid) {
      return;
    }
    this.partyALinkmanEditIndex = -1;
  }

  cancelPartyALinkman(index: number) {
    if (!this.partyALinkmanInfo.at(index).value.subcontractName) {
      this.delPartyALinkman(index);
    } else {
      this.partyALinkmanInfo.at(index).patchValue(this.partyALinkmanEditObj);
    }
    this.partyALinkmanEditIndex = -1;
  }

  proprietorLinkmanEditIndex: number = -1;
  proprietorLinkmanEditObj = {};
  createProprietorLinkman(): FormGroup {
    return this.fb.group({
      proprietorLinkmanName: [null],
      proprietorLinkmanCellphone: [null],
      proprietorLinkmanPhone: [null],
    });
  }
  addProprietorLinkman() {
    this.proprietorLinkmanInfo.push(this.createProprietorLinkman());
    this.editProprietorLinkman(this.proprietorLinkmanInfo.length - 1);
  }

  delProprietorLinkman(index: number) {
    // 表示有条目在编辑状态
    if (this.proprietorLinkmanEditIndex !== -1) {
      // 如果删除条目索引小于当前编辑条目索引，当前编辑条目索引-1
      if (index < this.proprietorLinkmanEditIndex) {
        this.proprietorLinkmanEditIndex -= 1;
      }
    }
    this.proprietorLinkmanInfo.removeAt(index);
  }

  editProprietorLinkman(index: number) {
    if (this.proprietorLinkmanEditIndex !== -1 && this.proprietorLinkmanEditObj) {
      this.proprietorLinkmanInfo.at(this.proprietorLinkmanEditIndex).patchValue(this.proprietorLinkmanEditObj);
    }
    this.proprietorLinkmanEditObj = { ...this.proprietorLinkmanInfo.at(index).value };
    this.proprietorLinkmanEditIndex = index;
  }

  saveProprietorLinkman(index: number) {
    this.proprietorLinkmanInfo.at(index).markAsDirty();
    if (this.proprietorLinkmanInfo.at(index).invalid) {
      return;
    }
    this.proprietorLinkmanEditIndex = -1;
  }

  cancelProprietorLinkman(index: number) {
    if (!this.proprietorLinkmanInfo.at(index).value.subcontractName) {
      this.delProprietorLinkman(index);
    } else {
      this.proprietorLinkmanInfo.at(index).patchValue(this.proprietorLinkmanEditObj);
    }
    this.proprietorLinkmanEditIndex = -1;
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
