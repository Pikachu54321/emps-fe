import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-file-newFolder',
  templateUrl: './file-newFolder.component.html',
  styleUrls: ['./file-newFolder.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileNewFolderComponent implements OnInit {
  constructor() {}
  isFolderNameError = true;
  folderNameValue = '';
  folderNameOnChange(value: string): void {
    // 文件名不能包含下列任何字符 \ / : * ? " < > |
    const reg = /^[^\\/:*?"<>|\s][^\\/:*?"<>|]{0,98}[^\\/:*?"<>|\s]$/;
    // 匹配1个字符的情况
    const reg1 = /^[^\\/:*?"<>|\s]$/;
    if (reg.test(value) || reg1.test(value)) {
      this.isFolderNameError = false;
    } else {
      this.isFolderNameError = true;
    }
    this.folderNameValue = value;
  }

  ngOnInit() {}
}
