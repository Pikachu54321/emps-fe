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
import { UploadFile, UploadChangeParam } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
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

@Component({
  selector: 'app-project-new',
  templateUrl: './project-new.component.html',
  styleUrls: ['./project-new.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNewComponent implements OnInit {
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
  // 项目立项路径配置参数
  projectNewFilePaths: ProjectNewFilePath[];
  // 上传文件的列表的列表，总表
  uploadFileLists: Array<UploadFile[]> = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalSrv: NzModalService,
    private service: ProjectService,
    private rd2: Renderer2,
    private cd: ChangeDetectorRef,
    private msg: NzMessageService,
  ) {
    // 读取项目立项路径配置参数
    this.service.getProjectNewPathParameter().subscribe((res: any) => {
      this.projectNewFilePaths = res.data.projectNewFilePaths;
      // 设定有几个上传文件列表 new Array<UploadFile[]>(this.projectNewFilePaths[0].children.length)
      for (let index = 0; index < this.projectNewFilePaths[0].children.length; index++) {
        this.uploadFileLists[index] = [];
      }
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
  editIndex = -1;
  editObj = {};
  subcontractSumValue = '';
  createSubcontract(): FormGroup {
    return this.fb.group({
      subcontractName: [null],
      subcontractSum: [null],
      subcontractDetails: [null],
      subcontractChecklist: [null],
    });
  }
  add() {
    this.subcontracts.push(this.createSubcontract());
    // 当按下添加分包按钮，保存的上一个分包金额清除
    this.subcontractSumValue = '';
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
    if (!this.subcontracts.at(index).value.subcontractName) {
      this.del(index);
    } else {
      this.subcontracts.at(index).patchValue(this.editObj);
    }
    this.editIndex = -1;
  }

  // 分包合同金额
  subcontractSumOnBlur(event: InputEvent, index: number): void {
    let value = (event.target as HTMLInputElement).value;
    if (event.data.charAt(value.length - 1) === '.' || value === '-') {
      this.updateNumValue(value.slice(0, -1), index);
    }
  }
  subcontractSumOnChange(event: InputEvent, index: number): void {
    this.updateNumValue((event.target as HTMLInputElement).value, index);
  }
  updateNumValue(value: string, index: number): void {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(+value) && reg.test(value)) || value === '' || value === '-') {
      this.subcontractSumValue = value;
    }
    this.subcontracts.at(index).get('subcontractSum').setValue(this.subcontractSumValue);
    // this.rd2.setProperty(this.subcontractSumInput.nativeElement, 'value', this.subcontractSumValue);
  }

  // 项目资料-路径配置
  // 根目录输入框
  @ViewChild('rootDirInputRef', { static: true }) rootDirInputRef: ElementRef;
  // 项目资料-路径配置-选择根目录按钮
  selectDirOnclick(value): void {
    let childPathConfig: ProjectNewFileChildPath = {
      text: '根目录',
      path: '',
      key: 'rootDir',
    };
    // 如果点击是根目录的配置按钮
    if (this.projectNewFilePaths[0].key === value) {
      childPathConfig.key = this.projectNewFilePaths[0].key;
      childPathConfig.text = this.projectNewFilePaths[0].text;
      childPathConfig.path = this.projectNewFilePaths[0].path;
    } else {
      // 遍历projectNewFilePath[0].children，找到被点击按钮的value值等于对象key值的对象
      for (const pathConfig of this.projectNewFilePaths[0].children) {
        // 找到被点击按钮的value值等于对象key值的对象
        if (pathConfig.key === value) {
          childPathConfig = pathConfig;
          break;
        }
      }
    }

    // 读取指定目录下文件、文件夹(并且排序)
    this.service.getFileListPage('', 'name', 'ASC').subscribe((res: any) => {
      let fileList: FileInfo[] = res.data.fileList;

      this.createFileSelectionModal(fileList, childPathConfig);
    });
  }

  // 创建文件夹路径对话框
  createFileSelectionModal(fileList: FileInfo[], pathConfig: ProjectNewFileChildPath): void {
    const modal: NzModalRef = this.modalSrv.create({
      nzTitle: pathConfig.text + '上传目录',
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
          style: 'float:right;',
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
            // 如果没有选中的文件夹
            if (FileSelectionComponent.nodeSelected === null) {
              return;
            } else {
              this.form.controls[pathConfig.key].setValue(FileSelectionComponent!.nodeSelected[0].key);
              // this.rd2.setProperty(this.rootDirInputRef.nativeElement, 'value', FileSelectionComponent!.nodeSelected[0].key);
            }
            // 如果点击的是根目录
            if (pathConfig.key === this.projectNewFilePaths[0].key) {
              // 自动配置其他路径配置
              for (const childPathConfig of this.projectNewFilePaths[0].children) {
                this.form.controls[childPathConfig.key].setValue(FileSelectionComponent!.nodeSelected[0].key + childPathConfig.path);
              }
            }
            modal.destroy();
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

  // 上传
  uploadFileList: UploadFile[] = [
    {
      uid: '1',
      name: 'xxx.png',
      status: 'done',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/xxx.png',
    },
    {
      uid: '2',
      name: 'yyy.png',
      status: 'done',
      url: 'http://www.baidu.com/yyy.png',
    },
    {
      uid: '3',
      name: 'zzz.png',
      status: 'error',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/zzz.png',
    },
  ];

  // 上传的地址
  uploadAction = `${environment.SERVER_URL}uploads`;
  handleChange({ file, fileList }: UploadChangeParam, i: number): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
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
