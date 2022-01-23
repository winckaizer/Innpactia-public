import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Client } from 'src/app/models/Client';
import { Phone } from 'src/app/models/Phone';
import { NotificationService } from 'src/app/services/notification.service';
import { PhoneService } from 'src/app/services/phone.service';

@Component({
	selector: 'app-phone',
	templateUrl: './phone.component.html',
	styleUrls: ['./phone.component.css']
})
export class PhoneComponent implements OnInit {
	frmClientPhone: FormGroup;
	phoneInfo!: any;
	showTable: boolean = true;

	@Input()
	modal: any;
	@Input()
	client!: Client;

	constructor(public frm: FormBuilder, private phoneService: PhoneService,
		private notifyService: NotificationService) {
		this.frmClientPhone = this.frm.group({
			id: 0,
			clientName: [''],
			clientId: 0,
			brand: [''],
			model: [''],
			serial: ['']
		});
	}

	ngOnInit(): void {
		this.frmClientPhone = this.frm.group({
			id: 0,
			clientName: this.client.fullname,
			clientId: this.client.id,
			brand: [''],
			model: [''],
			serial: ['']
		});

		this.listPhoneClientData(this.client.id);
	}

	reset(): void {
		this.frmClientPhone.reset();
	}

	sendPhoneData() {
		let phone = this.frmClientPhone.value;
		let request = (phone.id > 0) ? this.phoneService.update(phone) : this.phoneService.save(phone);

		request.subscribe({
			next: (data) => {
				this.listPhoneClientData(this.client.id);
				this.notifyService.showSuccess(data.message, "Exito!");
				this.reset();
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

	listPhoneClientData(id: Number): any {
		this.phoneService.list(id).subscribe({
			next: (data) => {
				this.phoneInfo = data;
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

	delete(phone: Phone, index: Number): void {
		if (window.confirm(`¿Realmente desea eliminar el dispositivo con serial: "${phone.serial}"?`)) {
			this.phoneService.delete(phone.id).subscribe({
				next: (data) => {
					this.phoneInfo.splice(index, 1);
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

	edit(data: Phone) {
		this.frmClientPhone = this.frm.group({
			id: data.id,
			clientName: data.client.fullname,
			clientId: data.client.id,
			brand: data.brand,
			model: data.model,
			serial: data.serial
		});
	}
}
