import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../models/Client';
import { Header } from '../models/Header';

@Injectable({
	providedIn: 'root'
})
export class PhoneService {
	api: string = "http://localhost:8081/phone/";
	header!: HttpHeaders;

	constructor(private http: HttpClient) {
		this.header = new HttpHeaders();
		this.header.set('Content-Type', 'application/json');
	}

	save(client: Client): Observable<any> {
		return this.http.post(this.api, client, Header.header());
	}

	list(id: Number): Observable<any> {
		return this.http.get(this.api + "client/" + id, Header.header());
	}

	delete(id: Number): Observable<any> {
		return this.http.delete(this.api + id, Header.header());
	}

	update(client: Client): Observable<any> {
		return this.http.put(this.api + client.id, client, Header.header());
	}
}
