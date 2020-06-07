import { NgModule } from '@angular/core';

import { ProjectInitialRoutingModule } from './project-routing.module';
import { SharedModule } from '@shared';
import { ProjectNewComponent } from './components';

@NgModule({
  imports: [SharedModule, ProjectInitialRoutingModule],
  declarations: [ProjectNewComponent],
})
export class ProjectModule {}
