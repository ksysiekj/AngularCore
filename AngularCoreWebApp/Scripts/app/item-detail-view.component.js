System.register(["@angular/core", "@angular/router", "./item", "./item.service", "./auth.service"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __moduleName = context_1 && context_1.id;
    var core_1, router_1, item_1, item_service_1, auth_service_1, ItemDetailViewComponent;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (item_1_1) {
                item_1 = item_1_1;
            },
            function (item_service_1_1) {
                item_service_1 = item_service_1_1;
            },
            function (auth_service_1_1) {
                auth_service_1 = auth_service_1_1;
            }
        ],
        execute: function () {
            ItemDetailViewComponent = (function () {
                function ItemDetailViewComponent(itemService, activatedRoute, router, authService) {
                    this.itemService = itemService;
                    this.activatedRoute = activatedRoute;
                    this.router = router;
                    this.authService = authService;
                }
                ItemDetailViewComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    var id = +this.activatedRoute.snapshot.params['id'];
                    if (id) {
                        this.itemService.get(id)
                            .subscribe(function (item) { return _this.item = item; });
                        console.log(this.item);
                    }
                    else if (id === 0) {
                        this.item = new item_1.Item(0, "New item", null);
                    }
                    else {
                        console.log("invalid id - routing back to home page");
                        this.router.navigate(["item/edit", 0]);
                    }
                };
                ItemDetailViewComponent.prototype.onItemDetailEdit = function (item) {
                    this.router.navigate(["item/edit", item.Id]);
                    return false;
                };
                ItemDetailViewComponent.prototype.onBack = function () {
                    this.router.navigate(['']);
                };
                return ItemDetailViewComponent;
            }());
            ItemDetailViewComponent = __decorate([
                core_1.Component({
                    selector: "item-detail-view",
                    styles: [],
                    template: "\n<div *ngIf=\"item\">\n    <h2>\n        <a href=\"javascript:void(0)\" (click)=\"onBack()\">&laquo; Back to Home</a>\n    </h2>\n    <div class=\"item-container\">\n        <ul class=\"nav nav-tabs\">\n            <li role=\"presentation\" *ngIf=\"authService.isLoggedIn()\">\n                <a href=\"javascript:void(0)\" (click)=\"onItemDetailEdit(item)\">Edit</a>\n            </li>\n            <li role=\"presentation\" class=\"active\">\n                <a href=\"javascript:void(0)\">View</a>\n            </li>\n        </ul>\n        <div class=\"panel panel-default\">\n            <div class=\"panel-body\">\n                <div class=\"item-image-panel\">\n                    <img src=\"/img/item-image-sample.png\" alt=\"{{item.Title}}\" />\n                    <div class=\"caption\">Sample image with caption.</div>\n                </div>\n                <h3>{{item.Title}}</h3>\n                <p>{{item.Description}}</p>\n                <p>{{item.Text}}</p>\n            </div>\n        </div>\n    </div>\n</div>\n"
                }),
                __metadata("design:paramtypes", [item_service_1.ItemService, router_1.ActivatedRoute, router_1.Router, auth_service_1.AuthService])
            ], ItemDetailViewComponent);
            exports_1("ItemDetailViewComponent", ItemDetailViewComponent);
        }
    };
});
