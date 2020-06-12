import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { ProjectRoot, Project, Employee, ContractType, FileListPage, ProjectNewFilePath } from '@shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}
  // 获得立项依据数组
  // [{
  //   // 立项依据编号
  //   id: '1',
  //   name: '合同',
  // }];

  // 项目立项页 project-new
  // 获得立项依据
  getRoots() {
    // `${environment.baseUrl}/profile`
    return this.http.get<ProjectRoot[]>(`${environment.SERVER_URL}projects/roots`);
  }
  // 获得所有主项目名
  getParentProjects() {
    return this.http.get<Project[]>(`${environment.SERVER_URL}projects/parent-projects`);
  }
  // 获得所有员工
  getEmployees() {
    return this.http.get<Employee[]>(`${environment.SERVER_URL}employees`);
  }
  // 获得所有合同类型
  getContractTypes() {
    return this.http.get<ContractType[]>(`${environment.SERVER_URL}contracts/types`);
  }
  // 获得项目立项路径配置参数
  getProjectNewPathParameter() {
    return this.http.get(`${environment.SERVER_URL}projects/project-new-path-parameters`);
  }
  // 读取指定目录下文件、文件夹(并且排序)
  getFileListPage(path: string, sortName: string, sortOrder: string) {
    return this.http.post(`${environment.SERVER_URL}file/read-directory`, {
      path: path,
      sortName: sortName,
      sortOrder: sortOrder,
    });
  }
  // 创建文件夹
  postNewFolder(parentFolderPath: string, newFoldername: string) {
    return this.http.post(`${environment.SERVER_URL}file/new-folder`, {
      parentFolderPath: parentFolderPath,
      newFoldername: newFoldername,
    });
  }
}
