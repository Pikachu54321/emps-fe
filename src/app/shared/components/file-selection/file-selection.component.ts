import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { FileInfo } from '@shared';
import { ProjectService } from 'src/app/routes/project/services';

@Component({
  selector: 'app-file-selection',
  templateUrl: './file-selection.component.html',
  styleUrls: ['./file-selection.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileSelectionComponent implements OnInit {
  @Input() fileList: FileInfo[];
  nodes = [];
  constructor(private projectService: ProjectService) {}

  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
    // load child async
    if (event.eventName === 'expand') {
      const node = event.node;
      if (node?.getChildren().length === 0 && node?.isExpanded) {
        // 读取指定目录下文件、文件夹(并且排序)
        this.projectService.getFileListPage('./', 'name', 'ASC').subscribe((res: any) => {
          let fileList: FileInfo[] = res.data.fileList;
          node.addChildren(this.folderFilter(fileList));
        });
        // this.loadNode().then((data) => {
        //   node.addChildren(data);
        // });
      }
    }
  }

  loadNode(): Promise<NzTreeNodeOptions[]> {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([
            { title: 'Child Node Child Node', key: `${new Date().getTime()}-0`, isLeaf: true },
            {
              title:
                'Child Node Child NodeChild Node Child NodeChild Node Child NodeChild Node Child NodeChild Node Child NodeChild Node Child Node',
              key: `${new Date().getTime()}-1`,
              isLeaf: false,
            },
          ]),
        10,
      );
    });
  }

  // 过滤文件夹。去除文件
  folderFilter(fileList: FileInfo[]) {
    let nodesIndex = 0;
    let nodes = [];
    for (let index = 0; index < this.fileList.length; index++) {
      const element = this.fileList[index];
      // 只保留文件夹
      if (element.isDir) {
        nodes[nodesIndex] = { title: element.name, key: element.path, isLeaf: !element.isDir };
        nodesIndex++;
      }
    }
    return nodes;
  }

  ngOnInit() {
    this.nodes = this.folderFilter(this.fileList);
  }
}
