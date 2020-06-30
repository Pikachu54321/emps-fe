import { NgModule } from '@angular/core';

import { ProjectInitialRoutingModule } from './project-routing.module';
import { SharedModule } from '@shared';
import { ProjectNewComponent, ProjectNewBasicInfoComponent, ProjectNewContractInfoComponent } from './components';

@NgModule({
  imports: [SharedModule, ProjectInitialRoutingModule],
  declarations: [ProjectNewComponent, ProjectNewBasicInfoComponent, ProjectNewContractInfoComponent],
})
export class ProjectModule {}
