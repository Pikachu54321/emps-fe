import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectNewComponent } from './components';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'new',
        component: ProjectNewComponent,
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
