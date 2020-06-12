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
  // 外层对话框传进来的数据用于初始化对话框
  @Input() fileList: FileInfo[];
  nodeSelected: NzTreeNode[] = null;
  @ViewChild('fileTreeComponent', { static: false }) fileTreeComponent!: NzTreeComponent;
  // 初始化[nzData]="nodes"
  nodes = [];
  constructor(private projectService: ProjectService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.nodes = this.folderFilter(this.fileList);
  }

  // 过滤文件夹。去除文件
  folderFilter(fileList: FileInfo[]) {
    let nodesIndex = 0;
    let nodes = [];
    // 如果是根目录，有可能会有fileList[0]为空的情况
    if (fileList[0]?.superPath === '') {
      // 初始化根节点
      nodes[0] = { title: '全部文件', key: fileList[0].superPath, isLeaf: false, children: [], expanded: true };
      for (let index = 0; index < fileList.length; index++) {
        const element = fileList[index];
        // 只保留文件夹
        if (element.isDir) {
          nodes[0].children[nodesIndex] = { title: element.name, key: element.path, isLeaf: !element.isDir };
          nodesIndex++;
        }
      }
    } else {
      for (let index = 0; index < fileList.length; index++) {
        const element = fileList[index];
        // 只保留文件夹
        if (element.isDir) {
          nodes[nodesIndex] = { title: element.name, key: element.path, isLeaf: !element.isDir };
          nodesIndex++;
        }
      }
    }

    return nodes;
  }

  // 点击节点或点击节点图标事件
  nzEvent(event: NzFormatEmitEvent): void {
    // load child async
    if (event.eventName === 'expand') {
      const node = event.node;
      if (node?.getChildren().length === 0 && node?.isExpanded) {
        // 读取指定目录下文件、文件夹(并且排序)
        this.projectService.getFileListPage(node.key, 'name', 'ASC').subscribe((res: any) => {
          node.addChildren(this.folderFilter(res.data.fileList));
        });
      }
    } else if (event.eventName === 'click') {
      // 因为节点点2次会取消选中，所以长度为0时返回null
      this.nodeSelected = this.fileTreeComponent.getSelectedNodeList().length === 0 ? null : this.fileTreeComponent.getSelectedNodeList();
    }
  }

  // 输入新建文件夹名字的对话框点击确定按钮函数
  newFolderOkOnClick(fileList: FileInfo[], newFolderParentKey: string, newFolderKey: string) {
    // 清除子节点
    this.fileTreeComponent.getSelectedNodeList()[0].clearChildren();
    this.fileTreeComponent.getSelectedNodeList()[0].addChildren(this.folderFilter(fileList));
    this.fileTreeComponent.getSelectedNodeList()[0].isExpanded = true;
    // 通过key获得新建文件夹节点，变成选中状态
    this.fileTreeComponent.getTreeNodeByKey(newFolderKey).isSelected = true;
    // 父文件夹取消选中状态
    this.fileTreeComponent.getTreeNodeByKey(newFolderParentKey).isSelected = false;
    // 因为节点点2次会取消选中，所以长度为0时返回null
    // 更新this下的，选中NzTreeNode[]数组
    this.nodeSelected = this.fileTreeComponent.getSelectedNodeList().length === 0 ? null : this.fileTreeComponent.getSelectedNodeList();
    console.log(111);
  }
}
