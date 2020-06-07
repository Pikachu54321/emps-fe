import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProjectService } from '../../services';
import { ProjectRoot, Project, Employee, ContractType, FileManagerComponent, FileSelectionComponent } from '@shared';

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
    // subscribe(tabs => {
    //   this.topMenus = tabs;
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
  @ViewChild('subcontractSumSpan', { static: false }) subcontractSumInput?: ElementRef;
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
  // 项目资料-路径配置-选择根目录
  selectRootDir(event: MouseEvent): void {
    const modal = this.modalSrv.create({
      nzTitle: (event.target as HTMLButtonElement).value + '路径',
      nzContent: FileManagerComponent,
      nzGetContainer: () => document.body,
      nzComponentParams: {
        // title: 'title in component',
        // subtitle: 'component sub title，will be changed after 2 sec',
      },
      nzOnOk: () => new Promise((resolve) => setTimeout(resolve, 1000)),
      nzFooter: [
        {
          label: 'change component title from outside',
          onClick: (componentInstance) => {
            // componentInstance!.title = 'title in inner component is changed';
          },
        },
      ],
    });
    const instance = modal.getContentComponent();
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    // Return a result when closed
    modal.afterClose.subscribe((result) => console.log('[afterClose] The result is:', result));

    // delay until modal instance created
    setTimeout(() => {
      // instance.subtitle = 'sub title is changed';
    }, 2000);
  }

  _submitForm() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
    if (this.form.invalid) {
      return;
    }
  }
}
