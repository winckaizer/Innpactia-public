import { Component } from '@angular/core';
import { NotificationService } from './services/notification.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'easy mobile repair';

  constructor(private notifyService : NotificationService) { }

  showToasterSuccess(){
      this.notifyService.showSuccess("Data shown successfully !!", "laratutorials.com")
  }

  showToasterError(){
      this.notifyService.showError("Something is wrong", "laratutorials.com")
  }

  showToasterInfo(){
      this.notifyService.showInfo("This is info", "laratutorials.com")
  }

  showToasterWarning(){
      this.notifyService.showWarning("This is warning", "laratutorials.com")
  }
}
