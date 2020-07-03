import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  ChangeDetectorRef,
  TemplateRef,
  QueryList,
  ViewChildren,
  Input,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { NzModalService, NzModalRef, ModalButtonOptions, ModalOptions } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectSizeType, NzSelectComponent, NzSelectOptionInterface, NzSelectItemInterface } from 'ng-zorro-antd/select';
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

  // 立项依据数组
  projectRoots: ProjectRoot[];
  // 用户数组
  users: User[];
  // 主项目数组
  parentProjects: Project[];

  // 关联项目下拉菜单是否禁用。项目属性为主项目或未选择时禁用
  // projectRelevanceDisabled: boolean = true;
  // 关联项目下拉菜单值
  projectRelevanceObj: Project = { id: undefined, name: null };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalSrv: NzModalService,
    private service: ProjectService,
    private rd2: Renderer2,
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
    private notify: NzNotificationService,
    public projectStepService: ProjectStepService,
  ) {
    // 获取立项依据
    this.service.getRoots().subscribe((res: any) => {
      this.projectRoots = res.data.projectRoots;
    });
    // 获取全部用户信息
    this.service.getUsers().subscribe((res: any) => {
      this.users = res.data.users;
    });
    // 获取主项目信息
    this.service.getParentProjects().subscribe((res: any) => {
      this.parentProjects = res.data.parentProjects;
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      projectName: [null, [Validators.required]],
      initRoot: [null, [Validators.required]],
      projectProperty: [null],
      projectRelevance: [null],
      projectManager: [null, [Validators.required]],
      projectMembers: [null],
    });
    this.form.patchValue(this.projectStepService);
  }

  //#region get form fields
  get projectName() {
    return this.form.controls.projectName;
  }
  get initRoot() {
    return this.form.controls.initRoot;
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
  formKeyDownFunction(event) {
    if (event.keyCode == 13) {
      // alert('you just clicked enter');
      // rest of your code
      return false;
    }
  }
  // 项目经理改变
  projectManagerChange(value: string): void {
    let projectMembersValue = this.projectMembers.value as Array<string>;
    // 如果项目成员不为空
    if (projectMembersValue) {
      for (let i = 0; i < projectMembersValue.length; i++) {
        if (projectMembersValue[i] === value) {
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
  // 关联项目太长时，下拉菜单显示不下，设置关联项目提示
  projectRelevanceChange($event): void {
    for (const item of this.parentProjects) {
      if (item.id === $event) {
        this.projectRelevanceObj = item;
        this.projectProperty.markAsDirty();
        this.projectProperty.updateValueAndValidity();
        break;
      }
    }
  }

  _submitForm() {
    // 验证上传文件重名、导入文件重名、文件没有上传完不可以提交
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
    if (this.form.invalid) {
      return;
    } else {
      Object.assign(this.projectStepService, this.form.value);
      this.projectStepService.step++;
    }
  }
}
