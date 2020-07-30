import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { ProjectService } from '../../services';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectOverviewComponent implements OnInit {
  searchValue = '';
  visible = false;

  constructor(private service: ProjectService) {}

  ngOnInit() {
    // 读取项目列表
    this.service.getProjectLists().subscribe((res: any) => {});
  }
  cols = [
    {
      title: 'Name',
      width: '180px',
    },
    {
      title: 'Age',
      width: '180px',
    },
    {
      title: 'Address',
      width: '200px',
    },
    {
      title: 'Actions',
    },
  ];

  listOfData = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ];
  onResize({ width }: NzResizeEvent, col: string): void {
    this.cols = this.cols.map((e) => (e.title === col ? { ...e, width: `${width}px` } : e));
  }
  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
  }
}
