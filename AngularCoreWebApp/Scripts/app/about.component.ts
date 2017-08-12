import {Component} from "@angular/core";

@Component({
    selector:"about",
    template: `
<h2>{{title}}</h2>
<div>OpenGameList: production ready, full featured SPA powered by asp.net core and angular2</div>
`
})

export class AboutComponent {
    title:string="About";
}