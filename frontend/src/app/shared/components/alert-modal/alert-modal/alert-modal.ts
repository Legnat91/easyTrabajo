import { Component, inject } from '@angular/core';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-alert-modal',

  templateUrl: './alert-modal.html',
})
export class AlertModal {
  public alertService=inject(AlertService);
}
