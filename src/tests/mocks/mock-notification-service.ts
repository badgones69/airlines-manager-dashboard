import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root',
})
export class MockNotificationService {
  constructor(readonly toastrService: ToastrService) {}

  public showSuccessNotification = (title: string, message: string): any => {
    return {
      toastId: 2,
      title,
      message
    }
  }

  public showErrorNotification = (title: string, message: string): any => {
    return {
      toastId: 1,
      title,
      message
    }
  }
}