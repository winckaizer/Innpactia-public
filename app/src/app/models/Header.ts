import { HttpHeaders } from "@angular/common/http";

export class Header {
	public static header() {
		return {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.getToken()}`
			})
		}
	}

	public static getToken(): any {
		return localStorage.getItem("auth");
	}
}
