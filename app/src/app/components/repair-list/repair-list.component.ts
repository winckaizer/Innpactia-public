import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification.service';
import { RepairService } from 'src/app/services/repair.service';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-repair-list',
	templateUrl: './repair-list.component.html',
	styleUrls: ['./repair-list.component.css']
})
export class RepairListComponent implements OnInit {
	showTable: boolean = true;
	repairInfo!: any;

	PHONE_STATUS = ["En Proceso", "Reparado", "Dañado"];

	constructor(public frm: FormBuilder, private modalService: NgbModal, private config: NgbModalConfig,
		private notifyService: NotificationService, private repairService: RepairService,
		private router: Router, private userService: UserService) {
	}

	ngOnInit(): void {
		this.userService.checkToken();
		this.listRepairData();
	}

	listRepairData(): any {
		this.repairService.list().subscribe({
			next: (data) => {
				this.repairInfo = data;
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

	goTo(page: string, id?: string) {
		this.router.navigateByUrl(`/${page}/${id}`);
	}

}
