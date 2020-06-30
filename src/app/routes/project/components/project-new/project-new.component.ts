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
  parentProjects: Project[];
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
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
    private notify: NzNotificationService,
  ) {
    // 读取项目立项路径配置参数
    this.service.getParentProjects().subscribe((res: any) => {
      this.parentProjects = res.data.parentProjects;
    });
    // 读取项目立项路径配置参数
    this.service.getProjectNewPathParameter().subscribe((res: any) => {
      this.projectNewFilePaths = res.data.projectNewFilePaths;
      // 设定有几个上传文件列表 new Array<UploadFile[]>(this.projectNewFilePaths[0].children.length)
      for (let index = 0; index < this.projectNewFilePaths[0].children.length; index++) {
        // this.uploadFileLists[index] = this.uploadFileList;
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
    // this.parentProjects$ = this.service.getParentProjects();
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
    // 表示有条目在编辑状态
    if (this.editIndex !== -1) {
      // 如果删除条目索引小于当前编辑条目索引，当前编辑条目索引-1
      if (index < this.editIndex) {
        this.editIndex -= 1;
      }
    }
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
  // 项目资料-路径配置-清除目录按钮
  clearDirOnclick(value): void {
    // 如果点击是根目录的配置按钮
    if (this.projectNewFilePaths[0].key === value) {
      this.form.controls[this.projectNewFilePaths[0].key].setValue(null);
    } else {
      // 遍历projectNewFilePath[0].children，找到被点击按钮的value值等于对象key值的对象
      for (const pathConfig of this.projectNewFilePaths[0].children) {
        // 找到被点击按钮的value值等于对象key值的对象
        if (pathConfig.key === value) {
          this.form.controls[pathConfig.key].setValue(null);
          break;
        }
      }
    }
  }

  // 项目资料-路径配置-选择根目录按钮
  selectDirOnclick(value): void {
    let childPathConfig: ProjectNewFileChildPath;
    // 如果点击是根目录的配置按钮
    if (this.projectNewFilePaths[0].key === value) {
      childPathConfig = {
        // text: '根目录',
        // path: '',
        // key: 'rootDir',
        text: this.projectNewFilePaths[0].text,
        path: this.projectNewFilePaths[0].path,
        key: this.projectNewFilePaths[0].key,
      };
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
    this.service.getFileListPage(this.projectNewFilePaths[0].path, 'name', 'ASC').subscribe((res: any) => {
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
        isDisplayFile: false,
        isMultiple: false,
        isFolderSelectable: true,
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
                // 如果文件夹创建成功或文件夹已存在，向服务器发送请求获取目录下所有文件、文件夹
                if (res.msg === 'ok' || res.msg === '文件夹已存在') {
                  service.getFileListPage(parentFolderPath, 'name', 'ASC').subscribe((res: any) => {
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
                } else {
                  // 如果服务器出现错误，返回
                  return;
                }
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
  @ViewChildren(NzUploadComponent) uploadComponents: QueryList<NzUploadComponent>;
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

  // 上传
  // 上传的地址
  uploadAction: string = `${environment.SERVER_URL}uploads`;
  // 当前上传的tab标签号
  currentUploadTabID: number = -1;
  // 上传post参数，是否为临时文件
  uploadData = {
    isTemp: true,
  };
  // 当点击或拖拽时调用
  getCurrentUploadTabID(id: number): void {
    // if (event.type === 'dragover') {
    //   event.preventDefault();
    //   return;
    // }
    this.currentUploadTabID = id;
  }
  // 导入按钮【服务器文件导入上传列表】
  importFileOnclick() {
    // 读取指定目录下文件、文件夹(并且排序)
    this.service.getFileListPage('', 'name', 'ASC').subscribe((res: any) => {
      let fileList: FileInfo[] = res.data.fileList;

      this.createImportFileModal(fileList);
    });
  }

  // 创建导入文件对话框
  createImportFileModal(fileList: FileInfo[]): void {
    const modal: NzModalRef = this.modalSrv.create({
      nzTitle: this.projectNewFilePaths[0]?.children[this.currentUploadTabID]?.text + '上传目录',
      nzContent: FileSelectionComponent,
      nzComponentParams: {
        fileList: fileList,
        isDisplayFile: true,
        isMultiple: true,
        isFolderSelectable: false,
      },
      // 点击蒙层是否允许关闭
      nzMaskClosable: false,
      // 是否显示右上角的关闭按钮。
      nzClosable: false,
      nzFooter: [
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
            // 如果没有选中的文件
            if (FileSelectionComponent.nodeSelected === null) {
              return;
            } else {
              // 遍历选中文件
              for (let index = 0; index < FileSelectionComponent.nodeSelected.length; index++) {
                const element = FileSelectionComponent.nodeSelected[index];
                let item: UploadFile = {
                  uid: Math.random().toString(36).substring(2),
                  name: element.title,
                  status: 'done',
                  response: `由"${element.key}/${element.title}"导入`,
                  url: `${element.key}/${element.title}`,
                };

                this.uploadFileLists[this.currentUploadTabID].push(item);
              }
              // 更新上传组件NzUploadComponent子组件NzUploadListComponent
              for (const uploadComponent of this.uploadComponents) {
                uploadComponent.listComp.detectChanges();
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

  // 上传前验证。屏蔽了，如果中途切换上传路径，之前上传的文件也可能和新目录下文件重名，所有取消了
  // beforeUpload = (file: UploadFile, fileList: UploadFile[]): Observable<boolean> => {
  //   let path = this.form.get(this.projectNewFilePaths[0].children[this.currentUploadTabID].key).value;

  //   return new Observable((observer: Observer<boolean>) => {
  //     // 查找是否和已上传文件重名，
  //     // 控制不了，如果1个大文件上传很慢，这期间又再次上传，上传列表没有这个正在上传的文件
  //     // 2个文件还是会重名
  //     // for (let index = 0; index < this.uploadFileLists[this.currentUploadTabID].length; index++) {
  //     //   if (this.uploadFileLists[this.currentUploadTabID][index]?.name === file.name) {
  //     //     const suffix = file.name.slice(file.name.lastIndexOf('.'));
  //     //     // 如果重名添加file.filename，file.name无法修改只读属性
  //     //     file.filename = file.name.slice(0, file.name.lastIndexOf('.')) + '_' + Date.now() + suffix;
  //     //     console.log(file.filename);
  //     //     break;
  //     //   }
  //     // }
  //     // 读取指定目录下文件、文件夹(并且排序)
  //     this.service.getFileListPage(path, 'name', 'ASC').subscribe((res: any) => {
  //       let fileList: FileInfo[] = res?.data?.fileList;

  //       // 表示文件夹不存在，可以上传
  //       if (res?.msg.substr(0, 33) == 'ENOENT: no such file or directory') {
  //         observer.next(true);
  //         observer.complete();
  //       }

  //       // 文件夹存在，查找是否和上传目录下的文件重名
  //       for (let index = 0; index < fileList.length; index++) {
  //         if (fileList[index].name === file.name) {
  //           // const suffix = file.name.slice(file.name.lastIndexOf('.'));
  //           // // 如果重名添加file.filename，file.name无法修改只读属性
  //           // file.filename = file.name.slice(0, file.name.lastIndexOf('.')) + '_' + Date.now() + suffix;
  //           this.notify.error('文件名已存在', `文件"${file.name}"在目录"${path}"下已存在`);
  //           observer.next(false);
  //           observer.complete();
  //           // break;
  //         }
  //       }
  //       observer.next(true);
  //       observer.complete();
  //     });
  //   });
  // };

  handleChange(uploadChangeParam: UploadChangeParam, i: number): void {
    const { file, fileList } = uploadChangeParam;
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
