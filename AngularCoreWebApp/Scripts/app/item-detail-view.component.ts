import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { Item } from "./item";
import { ItemService } from "./item.service";
import { AuthService } from "./auth.service";

@Component({
    selector: "item-detail-view",
    styles: [],
    template: `
<div *ngIf="item">
    <h2>
        <a href="javascript:void(0)" (click)="onBack()">&laquo; Back to Home</a>
    </h2>
    <div class="item-container">
        <ul class="nav nav-tabs">
            <li role="presentation" *ngIf="authService.isLoggedIn()">
                <a href="javascript:void(0)" (click)="onItemDetailEdit(item)">Edit</a>
            </li>
            <li role="presentation" class="active">
                <a href="javascript:void(0)">View</a>
            </li>
        </ul>
        <div class="panel panel-default">
            <div class="panel-body">
                <div class="item-image-panel">
                    <img src="/img/item-image-sample.png" alt="{{item.Title}}" />
                    <div class="caption">Sample image with caption.</div>
                </div>
                <h3>{{item.Title}}</h3>
                <p>{{item.Description}}</p>
                <p>{{item.Text}}</p>
            </div>
        </div>
    </div>
</div>
`
})

export class ItemDetailViewComponent implements OnInit {
    item: Item;

    constructor(private itemService: ItemService, private activatedRoute: ActivatedRoute, private router: Router, private authService:AuthService) { }

    ngOnInit() {
        var id = +this.activatedRoute.snapshot.params['id'];
        if (id) {
            this.itemService.get(id)
                .subscribe(item => this.item = item);

            console.log(this.item);
        }
        else if (id === 0) {
            this.item = new Item(0, "New item", null);
        } else {

            console.log("invalid id - routing back to home page");
            this.router.navigate(["item/edit", 0]);
        }
    }

    onItemDetailEdit(item: Item) {
        this.router.navigate(["item/edit", item.Id]);
        return false;
    }

    onBack() {
        this.router.navigate(['']);
    }
}