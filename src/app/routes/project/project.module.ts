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
  ProjectLinkmanFormComponent,
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
    ProjectLinkmanFormComponent,
  ],
})
export class ProjectModule {}
