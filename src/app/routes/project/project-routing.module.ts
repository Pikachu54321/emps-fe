import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectNewComponent, ProjectOverviewComponent } from './components';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'new',
        component: ProjectNewComponent,
      },
      {
        path: 'list',
        component: ProjectOverviewComponent,
      },
      // {
      //   path: ':productId',
      //   component: ProductContainerComponent
      // }
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectInitialRoutingModule {}
