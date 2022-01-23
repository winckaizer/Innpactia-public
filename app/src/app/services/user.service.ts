import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	api: string = "http://localhost:8081/user/";
	header!: HttpHeaders;

	constructor(private http: HttpClient) {
		this.header = new HttpHeaders();
		this.header.set('Content-Type', 'application/json');
	}

	save(user: User): Observable<any> {
		return this.http.post(this.api, user);
	}

	list(): Observable<any> {
		return this.http.get(this.api, { headers: this.header });
	}

	delete(id: Number): Observable<any> {
		return this.http.delete(this.api + id, { headers: this.header });
	}

	update(user: User): Observable<any> {
		return this.http.put(this.api + user.id, user);
	}
}
