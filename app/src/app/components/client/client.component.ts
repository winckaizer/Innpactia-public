import { compileClassMetadata } from '@angular/compiler';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

import { Client } from 'src/app/models/Client';
import { ClientService } from "src/app/services/client.service";
import { NotificationService } from 'src/app/services/notification.service';

@Component({
	selector: 'app-clients',
	templateUrl: './client.component.html',
	styleUrls: ['./client.component.css'],
	providers: [NgbModalConfig, NgbModal]
})

export class ClientComponent implements OnInit {
	frmClient: FormGroup;
	clientInfo!: any;

	onlyClient!: Client;
	ModalTitle: String = "Agregar";
	showTable: boolean = true;

	constructor(public frm: FormBuilder, private clientService: ClientService,
		private modalService: NgbModal, private config: NgbModalConfig,
		private notifyService: NotificationService) {
		config.backdrop = 'static';
		config.keyboard = false;
		config.windowClass = ""

		this.frmClient = this.frm.group({
			id: 0,
			idnumber: [''],
			fullname: [''],
			phoneNumber: [''],
			address: ['']
		});

	}

	ngOnInit(): void {
		this.listClientData();
	}

	reset(): void {
		this.frmClient.reset();
	}

	sendClientData(): any {
		let client = this.frmClient.value;
		let request = (client.id > 0) ? this.clientService.update(client) : this.clientService.save(client);

		request.subscribe({
			next: (data) => {
				this.listClientData();
				this.modalService.dismissAll();
				this.notifyService.showSuccess(data.message, "Exito!");
			},
			error: (e) => {
				if (e.error.errno == 500) {
					this.notifyService.showError(e.error.message, "Error de Servidor");
				} else {
					this.notifyService.showWarning(e.error.message, "Notificación!");
				}
			}
		});
	}

	listClientData(): any {
		this.clientService.list().subscribe({
			next: (data) => {
				this.clientInfo = data;
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

	deleteClientData(client: Client, index: Number): void {
		if (window.confirm(`¿Realmente desea eliminar al cliente: "${client.fullname}"?`)) {
			this.clientService.delete(client.id).subscribe({
				next: (data) => {
					this.clientInfo.splice(index, 1);
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

	editClient(clientModal: any, data: Client) {
		this.openModal(clientModal, "edit");

		this.frmClient.setValue({
			id: data.id,
			idnumber: data.idnumber,
			fullname: data.fullname,
			phoneNumber: data.phoneNumber,
			address: data.address
		})
	}

	phonesClientData(modal: any, client: Client) {
		this.onlyClient = client;
		this.modalService.open(modal, {
			centered: true,
			size: "lg",
			scrollable: true
		});
	}
}
