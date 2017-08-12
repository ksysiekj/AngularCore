import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";

@Injectable()
export class AuthHttp {
    http: Http = null;
    private authKey = "auth";

    constructor(http: Http) {
        this.http = http;
    }

    get(url, opts = {}) {
        this.configureAuth(opts);
        return this.http.get(url, opts);
    }

    post(url, data, opts = {}) {
        this.configureAuth(opts);
        return this.http.post(url, data, opts);
    }

    put(url, data, opts = {}) {
        this.configureAuth(opts);
        return this.http.put(url, data, opts);
    }

    delete(url, opts = {}) {
        this.configureAuth(opts);
        return this.http.delete(url, opts);
    }

    private configureAuth(opts: any) {

        var item = localStorage.getItem(this.authKey);
        if (item!=null) {
            var auth = JSON.parse(item);
            console.log(auth);
            if (auth.access_token != null) {
                if (opts.headers == null) {
                    opts.headers = new Headers();
                }

                opts.headers.set("Authorization", `Bearer ${auth.access_token}`);
            }
        }
    }
}