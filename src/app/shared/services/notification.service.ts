import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(readonly toastrService: ToastrService) {}

  public showSuccessNotification(title: string, message: string): void {
    this.toastrService.success(message, title, {
      positionClass: 'toast-bottom-center',
      closeButton: true,
      timeOut: 7000,
    });
  }

  public showInfoNotification(title: string, message: string): void {
    this.toastrService.info(message, title, {
      positionClass: 'toast-bottom-center',
      closeButton: true,
      timeOut: 7000,
    });
  }

  public showErrorNotification(title: string, message: string): void {
    this.toastrService.error(message, title, {
      positionClass: 'toast-bottom-center',
      closeButton: true,
      timeOut: 7000,
    });
  }

  public showWarningNotification(title: string, message: string): void {
    this.toastrService.warning(message, title, {
      positionClass: 'toast-bottom-center',
      closeButton: true,
      timeOut: 7000,
    });
  }
}
