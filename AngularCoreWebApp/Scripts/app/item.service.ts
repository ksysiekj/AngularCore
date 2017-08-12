import { Injectable } from "@angular/core";
import {  Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Item } from "./item";
import { AuthHttp } from './auth.http';

@Injectable()
export class ItemService {

    constructor(private http: AuthHttp) { }

    private baseUrl: string = "api/items/";

    getLatest(num?: number) {
        return this.doItemsGet("getlatest", num);
    }

    getMostVieved(num?: number) {
        return this.doItemsGet("getmostviewed", num);
    }

    getRandom(num?: number) {
        return this.doItemsGet("getrandom", num);
    }

    private doItemsGet(methodName: string, num?: number) {
        var url = this.baseUrl + methodName + "/";
        if (num != null) {
            url += num;
        }

        return this.http.get(url)
            .map(res => res.json())
            .catch(this.handleError);
    }

    get(id: number) {
        if (id == null) {
            throw new Error("id is required");
        }

        var url = this.baseUrl + id;

        return this.http.get(url)
            .map(res => <Item>res.json())
            .catch(this.handleError);
    }

    add(item: Item) {

        var url = this.baseUrl;
        return this.http.post(url, JSON.stringify(item), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError)
            ;
    }

    update(item: Item) {
        var url = this.baseUrl + item.Id;
        return this.http.put(url, JSON.stringify(item), this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    delete(id: number) {
        var url = this.baseUrl + id;

        return this.http.delete(url)
            .catch(this.handleError);
    }

    private getRequestOptions() {
        return new RequestOptions({
            headers: new Headers({ "Content-Type": "application/json" })
        });
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || "Server error");
    }
}