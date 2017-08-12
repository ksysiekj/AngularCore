import { Component, OnInit, Input } from "@angular/core";
import {Router} from "@angular/router";

import { Item } from "./item";
import { ItemService } from "./item.service";

@Component({
    selector: "item-list",
    styles: [],
    template: `
<h3>{{title}}</h3>
<ul class="items">
    <li *ngFor="let item of items"
        [class.selected]="item === selectedItem"
        (click)="onSelect(item)">
        <div class="title">{{item.Title}}</div>
        <div class="description">{{item.Description}}</div>
    </li>
</ul>
`
})

export class ItemListComponent implements OnInit {
    selectedItem: Item;
    items: Item[];
    errorMessage: string;
    title: string;
    @Input() class: string;

    constructor(private itemService: ItemService, private router:Router) { }

    ngOnInit() {

        var strategy = null;

        switch (this.class) {
            case "latest":
                this.title = "Latest Items";
                strategy = this.itemService.getLatest();
                break;

            case "most-viewed":
                this.title = "Most Viewed Items";
                strategy = this.itemService.getMostVieved();
                break;

            case "random":
                this.title = "Random Items";
                strategy = this.itemService.getRandom();
                break;
        }

        if (strategy != null) {
            strategy.subscribe(items => this.items = items,
                error => this.errorMessage = error
            );
        }
    }

    onSelect(item: Item) {
        this.selectedItem = item;
        this.router.navigate(["item/view",this.selectedItem.Id]);

        console.log("item id=" + this.selectedItem.Id + " has been selected");
    }
}