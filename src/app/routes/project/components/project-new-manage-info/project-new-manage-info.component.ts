import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, TemplateRef, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { ProjectService, ProjectStepService } from '../../services';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ProjectLinkmanFormComponent } from '../project-linkman-form';

@Component({
  selector: 'app-project-new-manage-info',
  templateUrl: './project-new-manage-info.component.html',
  styleUrls: ['./project-new-manage-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNewManageInfoComponent implements OnInit {
  // 输入框尺寸设置
  @Input() inputSize: NzSelectSizeType;
  // form: FormGroup;

  constructor(
    // private fb: FormBuilder,
    private service: ProjectService,
    public projectStepService: ProjectStepService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    // this.form = this.fb.group({
    //   linkmanInfo: this.fb.array([]),
    // });
    // 获取联系人类型信息
    this.service.getLinkmanTypes().subscribe((res: any) => {
      this.projectStepService.linkmanTypes = res.data.linkmanTypes;
      // this.form.patchValue(this.projectStepService);
    });
    // 如果linkmanInfo不为空，赋值
    if (this.projectStepService.linkmenInfo) {
      for (let index = 0; index < this.projectStepService.linkmenInfo?.length; index++) {
        // this.linkmanInfo.push(this.createLinkman());
      }
      // this.form.patchValue(this.projectStepService);
    }
  }

  //#region get form fields

  //#endregion

  // 防止按下回车表单提交
  formKeyDownFunction(event) {
    if (event.keyCode == 13) {
      return false;
    }
  }

  linkmanEditIndex: number = -1;
  linkmanEditObj = {};

  addLinkman(linkmanFormModalContent: TemplateRef<{}>) {
    // 创建联系人表单对话框
    const modal: NzModalRef = this.modalSrv.create({
      nzTitle: '新建联系人',
      nzContent: linkmanFormModalContent,
      nzComponentParams: {
        inputSize: 'large',
        linkmanTypes: this.projectStepService.linkmanTypes,
        linkmanEditIndex: this.linkmanEditIndex,
        linkmanInfo: null,
      },
      // 点击蒙层是否允许关闭
      nzMaskClosable: false,
      // 是否显示右上角的关闭按钮。
      // nzClosable: false,
      nzFooter: null,
    });
  }

  // 联系人表单提交成功
  linkmanFormSubmit(linkmanForm: FormGroup) {
    // 没有联系人信息被编辑，直接push到最后数组1个
    if (this.linkmanEditIndex === -1) {
      this.projectStepService.linkmenInfo = [...this.projectStepService.linkmenInfo, linkmanForm.value];
      // this.projectStepService.linkmenInfo.push(linkmanForm.value);
    } else {
      // 有联系人被编辑
      this.projectStepService.linkmenInfo[this.linkmanEditIndex] = linkmanForm.value;
    }
    // this.linkmenInfoTable.;
    this.cdr.markForCheck();
    this.linkmanEditIndex = -1;
  }

  // 取消提交
  cancelSubmit() {
    // 没有联系人被编辑，所以置为-1
    this.linkmanEditIndex = -1;
  }
  delLinkman(index: number) {
    this.projectStepService.linkmenInfo = this.projectStepService.linkmenInfo.filter((d, i) => i !== index);
  }

  editLinkman(index: number, linkmanFormModalContent: TemplateRef<{}>) {
    this.linkmanEditIndex = index;
    const modal: NzModalRef = this.modalSrv.create({
      nzTitle: '新建联系人',
      nzContent: linkmanFormModalContent,
      nzComponentParams: {
        inputSize: 'large',
        linkmanTypes: this.projectStepService.linkmanTypes,
        linkmanEditIndex: index,
        linkmanInfo: this.projectStepService.linkmenInfo[index],
      },
      // 点击蒙层是否允许关闭
      nzMaskClosable: false,
      // 是否显示右上角的关闭按钮。
      nzClosable: false,
      nzFooter: null,
    });
  }

  // 上一步
  prev() {
    // // 如果验证成功
    // if (this.verificationSave()) {
    //   ++this.projectStepService.step;
    // }
    --this.projectStepService.step;
  }
  next() {
    // // 如果验证成功
    // if (this.verificationSave()) {
    //   ++this.projectStepService.step;
    // }
    ++this.projectStepService.step;
  }
  // verificationSave(): boolean {
  //   // 验证上传文件重名、导入文件重名、文件没有上传完不可以提交
  //   Object.keys(this.form.controls).forEach((key) => {
  //     this.form.controls[key].markAsDirty();
  //     this.form.controls[key].updateValueAndValidity();
  //   });
  //   if (this.form.invalid) {
  //     return false;
  //   } else {
  //     Object.assign(this.projectStepService, this.form.value);
  //     return true;
  //   }
  // }
}
