import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from "src/app/services/user.service";
import { User } from "src/app/models/User";
import { Observable } from 'rxjs';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
	frmUser: FormGroup;
	userInfo!: any;

	ModalTitle: String = "Agregar";
	showTable: boolean = true;

	USER_ROLES = ["Administrador", "Empleado"];
	USER_STATUS = ["inactivo", "Activo"];

	constructor(public frm: FormBuilder, private modalService: NgbModal, private config: NgbModalConfig,
		private notifyService: NotificationService, private userService: UserService) {
		config.backdrop = 'static';
		config.keyboard = false;

		this.frmUser = this.frm.group({
			id: 0,
			fullname: [''],
			email: [''],
			passw: [''],
			role: [''],
			status: ['']
		});
	}

	ngOnInit(): void {
		this.userService.checkToken();

		this.listUserData();
	}

	reset(): void {
		this.frmUser.reset();
	}

	sendUserData(): any {
		let user = this.frmUser.value;
		let request = (user.id > 0) ? this.userService.update(user) : this.userService.save(user);

		request.subscribe({
			next: (data) => {
				this.listUserData();
				this.modalService.dismissAll();
				this.notifyService.showSuccess(data.message, "Exito!");

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

	listUserData(): any {
		this.userService.list().subscribe({
			next: (data) => {
				this.userInfo = data;
				this.showTable = true;
			},
			error: (e) => {
				this.showTable = false;
				if (e.status === 500) {
					this.notifyService.showError(e.error.message, "Error de Servidor");
				} else if (e.status !== 404) {
					this.notifyService.showWarning(e.error.message, "Notificacón!");
				}
			}
		});
	}

	deleteUserData(user: User, index: Number): void {
		if (window.confirm(`¿Realmente desea eliminar al usuario: "${user.email}"?`)) {
			this.userService.delete(user.id).subscribe({
				next: (data) => {
					this.userInfo.splice(index, 1);
					this.notifyService.showSuccess(data.message, "Exito!");
				},
				error: (e) => {
					if (e.status == 500) {
						this.notifyService.showError(e.error.message, "Error de Servidor");
					} else {
						this.notifyService.showWarning(e.error.message, "Notificacón!");
					}
				}
			})
		}
	}

	openModal(content: any, op?: string): void {
		this.modalService.open(content, {
			centered: true
		});

		if (op == "add") {
			this.ModalTitle = "Agregar Nuevo";
			this.reset();

		} else if (op == "edit") {
			this.ModalTitle = "Editar"
		}
	}

	edit(modal: any, data: User) {
		this.openModal(modal, "edit");

		this.frmUser.setValue({
			id: data.id,
			fullname: data.fullname,
			email: data.email,
			passw: data.passw,
			role: data.role,
			status: data.status
		})
	}

}
