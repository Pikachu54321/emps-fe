import { ChangeDetectionStrategy, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Project, LinkmanType } from '@shared';

@Component({
  selector: 'app-project-linkman-form',
  templateUrl: './project-linkman-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectLinkmanFormComponent implements OnInit {
  // 输入框尺寸设置
  @Input() inputSize: NzSelectSizeType;
  // 联系人类别数组
  @Input() linkmanTypes: LinkmanType[];
  // 当前编辑联系人索引，-1表示添加新联系人
  @Input() linkmanEditIndex: number;
  // 当前编辑联系人信息
  @Input() linkmanInfo: {
    linkmanName: string;
    linkmanType: LinkmanType;
    linkmanCompanyName: string;
    linkmanDuty: string;
    linkmanCellphone: string;
    linkmanPhone: string;
    linkmanQQ: string;
    linkmanWeChat: string;
    linkmanEmail: string;
  };
  // 此对话框引用
  @Input() modalRef: NzModalRef;
  // 输出表单
  @Output() linkmanForm = new EventEmitter<FormGroup>();
  // 取消输出
  @Output() cancelFn = new EventEmitter();
  form: FormGroup;

  projectRelevanceObj: Project = { id: undefined, name: null };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      linkmanName: [null, [Validators.required]],
      linkmanType: [null],
      linkmanCompanyName: [null],
      linkmanDuty: [null],
      linkmanCellphone: [null],
      linkmanPhone: [null],
      linkmanQQ: [null],
      linkmanWeChat: [null],
      linkmanEmail: [null],
    });
    // 如果联系人信息不为空
    if (this.linkmanInfo) {
      this.form.patchValue(this.linkmanInfo);
    }
  }

  //#region get form fields
  get linkmanName() {
    return this.form.controls.linkmanName;
  }
  get linkmanType() {
    return this.form.controls.linkmanType;
  }
  get linkmanCompanyName() {
    return this.form.controls.linkmanCompanyName;
  }
  get linkmanDuty() {
    return this.form.controls.linkmanDuty;
  }
  get linkmanCellphone() {
    return this.form.controls.linkmanCellphone;
  }
  get linkmanPhone() {
    return this.form.controls.linkmanPhone;
  }
  get linkmanQQ() {
    return this.form.controls.linkmanQQ;
  }
  get linkmanWeChat() {
    return this.form.controls.linkmanWeChat;
  }
  get linkmanEmail() {
    return this.form.controls.linkmanEmail;
  }
  //#endregion

  // 防止按下回车表单提交
  formKeyDownFunction(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      return false;
    }
  }
  // nz-select获得选项的对象，照官网写的不懂原理
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);
  cancel() {
    this.modalRef.destroy();
    this.cancelFn.emit();
  }
  _submitForm() {
    // 如果验证成功，向父组件输出
    if (this.verificationSave()) {
      this.modalRef.destroy();
      this.linkmanForm.emit(this.form);
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
      // Object.assign(this.projectStepService, this.form.value);
      return true;
    }
  }
}
