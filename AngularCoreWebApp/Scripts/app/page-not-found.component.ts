import {Component} from "@angular/core";

@Component({
    selector:"page-not-found",
    template: `
<h2>{{title}}</h2>
<div>OpenGameList: ooops...page doesnt exist (yet!)</div>
`
})

export class PageNotFoundComponent {
    title:string="Page not found";
}