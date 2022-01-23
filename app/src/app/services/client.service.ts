import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { Client } from '../models/Client';

@Injectable({
	providedIn: 'root'
})

export class ClientService {
	api: string = "http://localhost:8081/client/";
	header!: HttpHeaders;

	constructor(private http: HttpClient) {
		this.header = new HttpHeaders();
		this.header.set('Content-Type', 'application/json');
	 }

	save(client: Client): Observable<any> {
		return this.http.post(this.api, client);
	}

	list(id?: any): Observable<any> {
		id = (id) ? id : "";
		return this.http.get(this.api + id, {headers: this.header});
	}

	delete(id: Number): Observable<any> {
		return this.http.delete(this.api + id, {headers: this.header});
	}

	update(client: Client): Observable<any> {
		return this.http.put(this.api + client.id, client);
	}
}
