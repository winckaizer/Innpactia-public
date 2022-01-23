import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Client } from 'src/app/models/Client';
import { Phone } from 'src/app/models/Phone';
import { ClientService } from 'src/app/services/client.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PhoneService } from 'src/app/services/phone.service';
import { NgSelectComponent } from "@ng-select/ng-select";
import { RepairService } from 'src/app/services/repair.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Repair } from 'src/app/models/Repair';
import { formatDate, registerLocaleData } from '@angular/common';
import localeES from "@angular/common/locales/es";
import { UserService } from 'src/app/services/user.service';
registerLocaleData(localeES, "es");

@Component({
	selector: 'app-repair',
	templateUrl: './repair.component.html',
	styleUrls: ['./repair.component.css']
})


export class RepairComponent implements OnInit {
	frmRepair: FormGroup;
	selectedClient!: Number;
	selectClient!: any;

	selectedPhone!: Number;
	selectPhone!: any;

	onlyClient!: Client;

	phoneInfo = new Phone;

	PHONE_STATUS = ["En Proceso", "Reparado", "Dañado"];

	getId!: any;

	@ViewChild(NgSelectComponent) ngSelectComponent!: NgSelectComponent;
	@ViewChild("phoneSelect") phoneSelect: any;

	constructor(public frm: FormBuilder, private clientService: ClientService,
		private phoneService: PhoneService, private modalService: NgbModal,
		private config: NgbModalConfig, private notifyService: NotificationService,
		private repairService: RepairService, private router: Router,
		private activateRoute: ActivatedRoute, private userService: UserService) {

		this.frmRepair = this.frm.group({
			id: 0,
			clientId: 0,
			phoneId: 0,
			failure: [''],
			notes: [''],
			dateIn: [''],
			dateOut: [''],
			status: 0
		})
	}

	ngOnInit(): void {
		this.userService.checkToken();

		this.loadClientList();
		this.getId = this.activateRoute.snapshot.paramMap.get("id");
		if (this.getId !== null) {
			this.listRepairData(this.getId);
		}
	}

	reset() {
		this.frmRepair.reset();
	}

	loadClientList(): void {
		this.clientService.list().subscribe({
			next: (data) => {
				this.selectClient = data;
			},
			error: (e) => {
				if (e.status === 500) {
					this.notifyService.showError(e.error.message, "Error de Servidor");
				} else if (e.status !== 404) {
					this.notifyService.showWarning(e.error.message, "Notificacón!");
				}
			}
		});
	}

	listRepairData(id?: any): any {
		this.repairService.list(id).subscribe({
			next: (data) => {
				this.setFormToEdit(data[0]);
			},
			error: (e) => {
				if (e.status === 500) {
					this.notifyService.showError(e.error.message, "Error de Servidor");
				} else if (e.status !== 404) {
					this.notifyService.showWarning(e.error.message, "Notificacón!");
				}
			}
		});
	}

	setFormToEdit(data: Repair) {
		this.changeClientPhone(data.phone.client.id, true);

		let dateO = (data.dateOut !== null) ? formatDate(data.dateOut, 'yyyy-MM-dd', 'en') : "";

		this.frmRepair = this.frm.group({
			id: data.id,
			clientId: data.phone.client.id,
			phoneId: data.phone.id,
			failure: data.failure,
			notes: data.notes,
			dateIn: [formatDate(data.dateIn, 'yyyy-MM-dd', 'en')],
			dateOut: [dateO],
			status: data.status
		});

		let phoneName = data.phone.brand  + " " + data.phone.model  + " " + data.phone.serial;

		this.phoneSelect.select({ value: phoneName})

	}

	sendRepairData() {
		let repair = this.frmRepair.value;
		let request = (repair.id > 0) ? this.repairService.update(repair) : this.repairService.save(repair);
		request.subscribe({
			next: (data) => {
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

	changeClient(modal: any): void {
		this.clientService.list(this.selectedClient).subscribe({
			next: (data) => {
				this.onlyClient = data[0];

				this.modalService.open(modal, {
					centered: true,
					size: "lg",
					scrollable: true
				});
			},
			error: (e) => {
				if (e.status === 500) {
					this.notifyService.showError(e.error.message, "Error de Servidor");
				} else if (e.status !== 404) {
					this.notifyService.showWarning(e.error.message, "Notificacón!");
				}
			}
		});
	}

	changeClientPhone(selectedClient: any, second: boolean = false) {
		this.phoneService.list(selectedClient).subscribe({
			next: (data) => {
				if (!second) {
					this.clearPhoneSelect()
				}
				this.selectPhone = data;
			},
			error: (e) => {
				if (e.status === 500) {
					this.notifyService.showError(e.error.message, "Error de Servidor");
				} else if (e.status !== 404) {
					this.notifyService.showWarning(e.error.message, "Notificacón!");
				}
			}
		});
	}

	removeClientPhone() {
		this.selectPhone = null;
		this.clearPhoneSelect()
	}

	clearPhoneSelect() {
		this.phoneSelect.select({ value: null, label: "" });
	}

	parseDate(dateString: any): Date {
		if (dateString.target.value) {
			return new Date(dateString);
		}

		return new Date();
	}

}

