import { Injectable, EventEmitter } from "@angular/core";
import { Headers, Response, RequestOptions } from "@angular/http";

import { AuthHttp } from './auth.http';
import { User } from './user';

import { Observable } from "rxjs/Observable";


@Injectable()
export class AuthService {

    private authKey = "auth";
    private tokenUrl = "/api/connect/token";

    constructor(private http: AuthHttp) { }

    login(username: string, password: string): any {
        var data = {
            username: username,
            password: password,
            client_id: "OpenGameList",
            grant_type: "password",
            scope: "offline_access profile email"
        };

        return this.http.post(this.tokenUrl,
            AuthService.toUrlEncodedString(data),
            new RequestOptions({
                headers: new Headers({
                    "Content-Type": "application/x-www-form-urlencoded"
                })
            }))
            .map(response => {
                var auth = response.json();
                console.log("received auth json object: " + auth);
                this.setAuth(auth);
                return auth;
            });
    }

    logout(): any {
        return this.http.post(
            "api/Accounts/Logout",
            null)
            .map(response => {
                this.setAuth(null);
                return true;
            })
            .catch(err => {
                return Observable.throw(err);
            });
    }

    static toUrlEncodedString(data: any): string {
        var body: string = "";
        for (var key in data) {
            if (body.length) {
                body += "&";
            }
            body += key + "=";
            body += encodeURIComponent(data[key]);
        }

        return body;
    }

    setAuth(auth: any): boolean {
        if (auth) {
            localStorage.setItem(this.authKey, JSON.stringify(auth));
        } else {
            localStorage.removeItem(this.authKey);
        }

        return true;
    }

    getAuth(): any {

        var auth = localStorage.getItem(this.authKey);
        if (auth) {
            return JSON.parse(auth);
        }

        return null;
    }

    isLoggedIn(): boolean {
        return localStorage.getItem(this.authKey) != null;
    }

    get() {
        return this.http.get("api/accounts")
            .map(response => response.json());
    }

    add(user: User) {
        return this.http.post("api/accounts", JSON.stringify(user), new RequestOptions({
            headers: new Headers({
                "Content-Type": "application/json"
            })
        }))
            .map(response => response.json())
            ;
    }

    update(user: User) {
        return this.http.put("api/accounts", JSON.stringify(user), new RequestOptions({
                    headers: new Headers({
                        "Content-Type": "application/json"
                    })
                }))
                .map(response => response.json())
            ;
    }
}
