import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectStepService } from '../../services';

@Component({
  selector: 'app-project-new-success',
  templateUrl: './project-new-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNewSuccessComponent {
  constructor(public projectStepService: ProjectStepService, private router: Router) {}
  goProjectList() {
    this.router.navigateByUrl('/projects/list');
  }
}
