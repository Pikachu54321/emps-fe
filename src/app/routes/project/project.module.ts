import { NgModule } from '@angular/core';

import { ProjectInitialRoutingModule } from './project-routing.module';
import { SharedModule } from '@shared';
import {
  ProjectNewComponent,
  ProjectNewBasicInfoComponent,
  ProjectNewContractInfoComponent,
  ProjectNewManageInfoComponent,
  ProjectNewSubcontractInfoComponent,
  ProjectNewDataInfoComponent,
  ProjectNewConfirmationInfoComponent,
} from './components';

@NgModule({
  imports: [SharedModule, ProjectInitialRoutingModule],
  declarations: [
    ProjectNewComponent,
    ProjectNewBasicInfoComponent,
    ProjectNewContractInfoComponent,
    ProjectNewManageInfoComponent,
    ProjectNewSubcontractInfoComponent,
    ProjectNewDataInfoComponent,
    ProjectNewConfirmationInfoComponent,
  ],
})
export class ProjectModule {}
