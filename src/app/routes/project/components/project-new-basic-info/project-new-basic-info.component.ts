import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { zip } from 'rxjs';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { ProjectService, ProjectStepService } from '../../services';
import { ProjectRoot, Project, User } from '@shared';

@Component({
  selector: 'app-project-new-basic-info',
  templateUrl: './project-new-basic-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNewBasicInfoComponent implements OnInit {
  // 输入框尺寸设置
  @Input() inputSize: NzSelectSizeType;

  form: FormGroup;

  // 关联项目下拉菜单值
  projectRelevanceObj: Project = { id: undefined, name: null };

  constructor(
    private fb: FormBuilder,

    private service: ProjectService,

    public projectStepService: ProjectStepService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      projectName: [null, [Validators.required]],
      initRoot: [null, [Validators.required]],
      initRootDate: [null],
      initRootMessage: [null],
      projectProperty: [null],
      projectRelevance: [null],
      projectManager: [null, [Validators.required]],
      projectMembers: [null],
    });

    // 获取立项依据、全部用户信息、主项目信息
    zip(this.service.getRoots(), this.service.getUsers(), this.service.getParentProjects()).subscribe((res: [any, any, any]) => {
      this.projectStepService.projectRoots = res[0].data.projectRoots;
      this.projectStepService.users = res[1].data.users;
      this.projectStepService.parentProjects = res[2].data.parentProjects;
      this.form.patchValue(this.projectStepService);
    });
  }

  //#region get form fields
  get projectName() {
    return this.form.controls.projectName;
  }
  get initRoot() {
    return this.form.controls.initRoot;
  }
  get initRootDate() {
    return this.form.controls.initRootDate;
  }
  get initRootMessage() {
    return this.form.controls.initRootMessage;
  }
  get projectProperty() {
    return this.form.controls.projectProperty;
  }
  get projectRelevance() {
    return this.form.controls.projectRelevance;
  }
  get projectManager() {
    return this.form.controls.projectManager;
  }
  get projectMembers() {
    return this.form.controls.projectMembers;
  }
  get initDate() {
    return this.form.controls.initDate;
  }
  //#endregion

  // 防止按下回车表单提交
  formKeyDownFunction(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      return false;
    }
  }

  // 项目经理改变
  projectManagerChange(value: User): void {
    let projectMembersValue = this.projectMembers.value as Array<User>;
    // 如果项目成员不为空
    if (projectMembersValue) {
      for (let i = 0; i < projectMembersValue.length; i++) {
        if (projectMembersValue[i].id === value.id) {
          // 从已选中的成员中成员删除项目经理
          projectMembersValue.splice(i, 1);
          break;
        }
      }
      this.projectMembers.setValue(projectMembersValue);
      this.projectMembers.markAsDirty();
      this.projectMembers.updateValueAndValidity();
    }
  }
  // 项目属性改变。主项目、子项目
  projectPropertyChange(value: string): void {
    if (value === 'child') {
      this.projectStepService.projectRelevanceDisabled = false;
    } else {
      // 当项目属性改变为主项目时，关联项目下拉菜单重置，提示关联项目文字清空
      this.projectStepService.projectRelevanceDisabled = true;
      this.projectRelevance.reset();
      this.projectRelevanceObj = { id: undefined, name: null };
    }
    this.projectRelevance.markAsDirty();
    this.projectRelevance.updateValueAndValidity();
  }
  // 设置关联项目提示。目的：关联项目太长时，下拉菜单显示不下
  projectRelevanceChange($event): void {
    if ($event) {
      this.projectRelevanceObj = $event;
    }
  }
  // nz-select获得选项的对象，照官网写的不懂原理
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);
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
