import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNodeOptions, NzTreeComponent, NzTreeNode } from 'ng-zorro-antd/tree';
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
  nodeSelected: NzTreeNode[] = null;
  @ViewChild('fileTreeComponent', { static: false }) fileTreeComponent!: NzTreeComponent;
  nodes = [];
  constructor(private projectService: ProjectService, private cdr: ChangeDetectorRef) {}

  nzEvent(event: NzFormatEmitEvent): void {
    // load child async
    if (event.eventName === 'expand') {
      const node = event.node;
      if (node?.getChildren().length === 0 && node?.isExpanded) {
        // 读取指定目录下文件、文件夹(并且排序)
        this.projectService.getFileListPage(node.key, 'name', 'ASC').subscribe((res: any) => {
          this.fileList = res.data.fileList;
          node.addChildren(this.folderFilter(this.fileList));
        });
      }
    } else if (event.eventName === 'click') {
      // 因为节点点2次会取消选中，所以长度为0时返回null
      this.nodeSelected = this.fileTreeComponent.getSelectedNodeList().length === 0 ? null : this.fileTreeComponent.getSelectedNodeList();
    }
  }

  // 过滤文件夹。去除文件
  folderFilter(fileList: FileInfo[]) {
    let nodesIndex = 0;
    let nodes = [];
    // 如果是根目录，有可能会有fileList[0]为空的情况
    if (fileList[0]?.superPath === '') {
      // 初始化根节点
      nodes[0] = { title: '全部文件', key: fileList[0].superPath, isLeaf: false, children: [], expanded: true };
      for (let index = 0; index < this.fileList.length; index++) {
        const element = this.fileList[index];
        // 只保留文件夹
        if (element.isDir) {
          nodes[0].children[nodesIndex] = { title: element.name, key: element.path, isLeaf: !element.isDir };
          nodesIndex++;
        }
      }
    } else {
      for (let index = 0; index < this.fileList.length; index++) {
        const element = this.fileList[index];
        // 只保留文件夹
        if (element.isDir) {
          nodes[nodesIndex] = { title: element.name, key: element.path, isLeaf: !element.isDir };
          nodesIndex++;
        }
      }
    }

    return nodes;
  }
  // 输入新建文件夹名字的对话框点击确定按钮函数
  newFolderOkOnClick(fileList: FileInfo[]) {
    this.fileTreeComponent.getSelectedNodeList()[0].isExpanded = true;
    // 清除子节点
    this.fileTreeComponent.getSelectedNodeList()[0].clearChildren();
    this.fileTreeComponent.getSelectedNodeList()[0].addChildren(this.folderFilter(fileList));
  }

  ngOnInit() {
    this.nodes = this.folderFilter(this.fileList);
  }
}
