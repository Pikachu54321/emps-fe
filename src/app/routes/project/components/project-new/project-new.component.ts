import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  ChangeDetectorRef,
  TemplateRef,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NzModalService, NzModalRef, ModalButtonOptions, ModalOptions } from 'ng-zorro-antd/modal';
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
} from '@shared';

@Component({
  selector: 'app-project-new',
  templateUrl: './project-new.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNewComponent implements OnInit {
  editIndex = -1;
  editObj = {};

  form: FormGroup;

  // 立项依据数组
  projectRoots$: Observable<ProjectRoot[]>;
  // 主项目数组
  parentProjects$: Observable<Project[]>;
  // 员工数组
  employees$: Observable<Employee[]>;
  // 合同类型数组
  contractTypes$: Observable<ContractType[]>;
  // 关联项目下拉菜单是否禁用。项目属性为主项目或未选择时禁用
  projectRelevanceDisabled: boolean = true;
  // 关联项目下拉菜单值
  projectRelevanceObj: Project = { id: undefined, name: null };
  // 表单页面日期格式
  dateFormat = 'yyyy/MM/dd';
  // users: any[] = [
  //   { value: 'xiao', label: '付晓晓' },
  //   { value: 'mao', label: '周毛毛' },
  // ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalSrv: NzModalService,
    private service: ProjectService,
    private rd2: Renderer2,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      projectName: [null, [Validators.required]],
      initRoot: [null, [Validators.required]],
      projectProperty: [null],
      projectRelevance: [null],
      projectManager: [null],
      initDate: [null, [Validators.required]],
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
      subcontracts: this.fb.array([]),
      rootDir: [null],
      technologyAgreementDir: [null],
      technologySchemeDir: [null],
      budgetDir: [null],
      settlementDir: [null],
      productionSchedulingNoticeDir: [null],
    });
    this.projectRoots$ = this.service.getRoots();
    this.parentProjects$ = this.service.getParentProjects();
    this.employees$ = this.service.getEmployees();
    this.contractTypes$ = this.service.getContractTypes();
    // const userList = [
    //   {
    //     key: '1',
    //     workId: '00001',
    //     name: 'John Brown',
    //     department: 'New York No. 1 Lake Park',
    //   },
    //   {
    //     key: '2',
    //     workId: '00002',
    //     name: 'Jim Green',
    //     department: 'London No. 1 Lake Park',
    //   },
    //   {
    //     key: '3',
    //     workId: '00003',
    //     name: 'Joe Black',
    //     department: 'Sidney No. 1 Lake Park',
    //   },
    // ];
    // userList.forEach((i) => {
    //   const field = this.createUser();
    //   field.patchValue(i);
    //   this.items.push(field);
    // });
  }

  createSubcontract(): FormGroup {
    return this.fb.group({
      subcontractName: [null],
      subcontractSum: [null],
      subcontractDetails: [null],
      subcontractChecklist: [null],
    });
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
  get subcontracts() {
    return this.form.controls.subcontracts as FormArray;
  }
  //#endregion
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
    this.parentProjects$.subscribe((relevanceProjects) => {
      for (const item of relevanceProjects) {
        if (item.id === $event) {
          this.projectRelevanceObj = item;
          this.projectProperty.markAsDirty();
          this.projectProperty.updateValueAndValidity();
          break;
        }
      }
    });
  }
  // 分包
  add() {
    this.subcontracts.push(this.createSubcontract());
    this.edit(this.subcontracts.length - 1);
  }

  del(index: number) {
    this.subcontracts.removeAt(index);
  }

  edit(index: number) {
    if (this.editIndex !== -1 && this.editObj) {
      this.subcontracts.at(this.editIndex).patchValue(this.editObj);
    }
    this.editObj = { ...this.subcontracts.at(index).value };
    this.editIndex = index;
  }

  save(index: number) {
    this.subcontracts.at(index).markAsDirty();
    if (this.subcontracts.at(index).invalid) {
      return;
    }
    this.editIndex = -1;
  }

  cancel(index: number) {
    if (!this.subcontracts.at(index).value.key) {
      this.del(index);
    } else {
      this.subcontracts.at(index).patchValue(this.editObj);
    }
    this.editIndex = -1;
  }

  // 分包合同金额
  @ViewChild('subcontractSumInput', { static: false }) subcontractSumInput?: ElementRef;
  subcontractSumValue = '';

  // '.' at the end or only '-' in the input box.
  subcontractSumOnBlur(): void {
    if (this.subcontractSumValue.charAt(this.subcontractSumValue.length - 1) === '.' || this.subcontractSumValue === '-') {
      this.updateNumValue(this.subcontractSumValue.slice(0, -1));
    }
  }
  subcontractSumOnChange(value: string): void {
    this.updateNumValue(value);
  }
  updateNumValue(value: string): void {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(+value) && reg.test(value)) || value === '' || value === '-') {
      this.subcontractSumValue = value;
    }
    this.rd2.setProperty(this.subcontractSumInput.nativeElement, 'value', this.subcontractSumValue);
  }

  // 根目录输入框
  @ViewChild('rootDirInputRef', { static: true }) rootDirInputRef: ElementRef;
  // 项目立项路径配置参数
  projectNewFilePath: ProjectNewFilePath;
  // 项目资料-路径配置-选择根目录按钮
  selectDirOnclick(event: MouseEvent): void {
    // 读取项目立项路径配置参数
    this.service.getProjectNewPathParameter().subscribe((res: any) => {
      this.projectNewFilePath = res.data.projectNewFilePath;
    });
    // 读取指定目录下文件、文件夹(并且排序)
    this.service.getFileListPage('', 'name', 'ASC').subscribe((res: any) => {
      let fileList: FileInfo[] = res.data.fileList;
      this.createFileSelectionModal(fileList, event);
    });
  }
  // 创建文件夹路径对话框
  createFileSelectionModal(fileList: FileInfo[], event: MouseEvent): void {
    const modal: NzModalRef = this.modalSrv.create({
      nzTitle: (event.target as HTMLButtonElement).value + '路径',
      nzContent: FileSelectionComponent,
      // nzGetContainer: () => document.body,
      nzComponentParams: {
        fileList: fileList,
      },
      // 点击蒙层是否允许关闭
      nzMaskClosable: false,
      // 是否显示右上角的关闭按钮。
      nzClosable: false,
      nzFooter: [
        {
          label: '新建文件夹',
          type: 'default',
          disabled: (FileSelectionComponent) => {
            if (FileSelectionComponent.nodeSelected === null) {
              return true;
            } else {
              return false;
            }
          },
          onClick: (FileSelectionComponent) => {
            // 创建输入新建文件夹名的对话框
            this.createFileNewFolderModal(FileSelectionComponent, this.service);
          },
        },
        {
          label: '确定',
          type: 'primary',
          disabled: (FileSelectionComponent) => {
            if (FileSelectionComponent.nodeSelected === null) {
              return true;
            } else {
              return false;
            }
          },
          onClick: (FileSelectionComponent) => {
            if (FileSelectionComponent.nodeSelected === null) {
              return;
            } else {
              this.rd2.setProperty(this.rootDirInputRef.nativeElement, 'value', FileSelectionComponent!.nodeSelected[0].key);
            }
            modal.destroy();
            this.form.controls['rootDir'].markAsDirty();
            this.form.controls['rootDir'].updateValueAndValidity();
          },
        },
        {
          label: '取消',
          type: 'default',
          onClick: () => {
            modal.destroy();
          },
        },
      ],
    });
  }

  // 创建输入文件夹名对话框
  createFileNewFolderModal(FileSelectionComponent: FileSelectionComponent, service: ProjectService): void {
    // 创建输入新建文件夹名的对话框
    const modal: NzModalRef = this.modalSrv.create({
      nzTitle: '新建文件夹',
      nzContent: FileNewFolderComponent,
      // 点击蒙层是否允许关闭
      nzMaskClosable: false,
      // 是否显示右上角的关闭按钮。
      nzClosable: false,
      nzFooter: [
        {
          label: '确定',
          type: 'primary',
          loading: false,
          disabled(this, fileNewFoldercomponentInstance): boolean {
            return fileNewFoldercomponentInstance.isFolderNameError;
          },
          // 新建文件夹提交
          onClick(this, fileNewFoldercomponentInstance): void {
            // 异步关闭
            this.loading = true;
            // 文件名错误，返回
            if (fileNewFoldercomponentInstance.isFolderNameError) {
              return;
            } else {
              let parentFolderPath = FileSelectionComponent.nodeSelected[0].key;
              let newFoldername = fileNewFoldercomponentInstance.folderNameValue;
              // 新建文件夹
              service.postNewFolder(parentFolderPath, newFoldername).subscribe((res: any) => {
                // 如果服务器出现错误，返回
                if (res.msg !== 'ok') {
                  return;
                }
                // 显示新建文件夹
                FileSelectionComponent.newFolderOkOnClick(res.data.fileList, parentFolderPath, parentFolderPath + '/' + newFoldername);
                // 异步关闭
                this.loading = false;
                modal.destroy();
              });
            }
          },
        },
        {
          label: '取消',
          type: 'default',
          onClick: () => {
            modal.destroy();
          },
        },
      ],
    });
  }

  _submitForm() {
    // 对话框没有销毁
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
    if (this.form.invalid) {
      return;
    }
  }
}
