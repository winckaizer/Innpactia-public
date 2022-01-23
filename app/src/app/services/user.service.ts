import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../models/Login';
import { User } from '../models/User';
import { Router } from '@angular/router';
import { Header } from '../models/Header';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	api: string = "http://localhost:8081/user/";
	//header!: HttpHeaders;

	constructor(private http: HttpClient, private router: Router) {

	}

	save(user: User): Observable<any> {
		return this.http.post(this.api, user, Header.header());
	}

	list(): Observable<any> {
		return this.http.get(this.api, Header.header());
	}

	delete(id: Number): Observable<any> {
		return this.http.delete(this.api + id, Header.header());
	}

	update(user: User): Observable<any> {
		return this.http.put(this.api + user.id, user, Header.header());
	}

	login(login: Login) {
		return this.http.post(this.api + "/login", login);
	}

	getToken(): any {
		return localStorage.getItem("auth");
	}

	setToken(token: any) {
		localStorage.setItem("auth", token);
	}

	deleteToken() {
		localStorage.clear();
	}

	checkToken(): any {
		if (this.getToken() == null) {
			this.router.navigateByUrl("/login");
			throw "stop";
		}
	}


}
