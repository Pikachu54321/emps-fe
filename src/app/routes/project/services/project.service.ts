import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { ProjectRoot, Project, Employee, ContractType } from '@shared';
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
}
