import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	frmLogin: FormGroup;
	token!: any;

	constructor(public frm: FormBuilder, private userService: UserService,
		private notifyService: NotificationService, private router: Router) {
		this.frmLogin = this.frm.group({
			email: [''],
			passw: ['']
		})
	}

	ngOnInit(): void {

	}

	doLogin() {
		let login = this.frmLogin.value;

		this.userService.login(login).subscribe({
			next: (data) => {
				this.token = data;
				this.userService.setToken(this.token.token);
				this.router.navigateByUrl("/repair-list");
			},
			error: (e) => {
				if (e.status == 500) {
					this.notifyService.showError(e.error.message, "Error de Servidor");
				} else {
					this.notifyService.showWarning(e.error.message, "Notificación!");
				}
			}
		});
	}

}
