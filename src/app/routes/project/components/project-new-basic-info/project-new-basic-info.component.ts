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
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { NzModalService, NzModalRef, ModalButtonOptions, ModalOptions } from 'ng-zorro-antd/modal';
import { UploadFile, UploadChangeParam, NzUploadComponent } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProjectService } from '../../services';
import {
  ProjectRoot,
  Project,
  Employee,
  ContractType,
  FileManagerComponent,
  FileSelectionComponent,
  FileListPage,
  FileInfo,
  FileNewFolderComponent,
  ProjectNewFilePath,
  ProjectNewFileChildPath,
} from '@shared';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-project-new-basic-info',
  templateUrl: './project-new-basic-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNewBasicInfoComponent implements OnInit {
  form: FormGroup;

  // 立项依据数组
  projectRoots$: Observable<ProjectRoot[]>;
  // 主项目数组
  parentProjects: Project[];
  // 员工数组
  employees$: Observable<Employee[]>;
  // 关联项目下拉菜单是否禁用。项目属性为主项目或未选择时禁用
  projectRelevanceDisabled: boolean = true;
  // 关联项目下拉菜单值
  projectRelevanceObj: Project = { id: undefined, name: null };
  // 表单页面日期格式
  dateFormat = 'yyyy/MM/dd';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalSrv: NzModalService,
    private service: ProjectService,
    private rd2: Renderer2,
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
    private notify: NzNotificationService,
  ) {
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
      projectManager: [null],
      initDate: [null, [Validators.required]],
    });
    this.projectRoots$ = this.service.getRoots();
    // this.parentProjects$ = this.service.getParentProjects();
    this.employees$ = this.service.getEmployees();
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
  // 项目属性改变。主项目、子项目
  projectPropertyChange(value: string): void {
    if (value === 'child') {
      this.projectRelevanceDisabled = false;
    } else {
      // 当项目属性改变为主项目时，关联项目下拉菜单重置，提示关联项目文字清空
      this.projectRelevanceDisabled = true;
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
