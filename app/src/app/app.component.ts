import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './services/notification.service'
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'easy mobile repair';

  checkSession: boolean = true;

  constructor(private notifyService : NotificationService,
	private userService: UserService,  private router: Router) {
	  //this.checkSession = (this.userService.getToken() !== null);
  }

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

  logOut() {
	  this.userService.deleteToken();
	  this.router.navigateByUrl("/login");
  }
}
