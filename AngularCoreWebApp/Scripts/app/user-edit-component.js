System.register(["@angular/core", "@angular/forms", "@angular/router", "./auth.service", "./user"], function (exports_1, context_1) {
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
    var core_1, forms_1, router_1, auth_service_1, user_1, UserEditComponent;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (auth_service_1_1) {
                auth_service_1 = auth_service_1_1;
            },
            function (user_1_1) {
                user_1 = user_1_1;
            }
        ],
        execute: function () {
            UserEditComponent = (function () {
                function UserEditComponent(fb, router, authService, activatedRoute) {
                    this.fb = fb;
                    this.router = router;
                    this.authService = authService;
                    this.activatedRoute = activatedRoute;
                    this.title = "New user registration";
                    this.userForm = null;
                    this.errorMessage = null;
                    this.isRegister = (activatedRoute.snapshot.url[0].path === "register");
                    if ((this.isRegister && this.authService.isLoggedIn())
                        || (!this.isRegister && !this.authService.isLoggedIn())) {
                        this.router.navigate([""]);
                    }
                    if (!this.isRegister) {
                        this.title = "Edit account";
                    }
                }
                UserEditComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.userForm = this.fb.group({
                        username: [
                            "", [
                                forms_1.Validators.required,
                                forms_1.Validators.pattern("[a-zA-Z0-9]+")
                            ]
                        ],
                        email: [
                            "", [
                                forms_1.Validators.required,
                                forms_1.Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
                            ]
                        ],
                        password: [
                            "", [
                                forms_1.Validators.required,
                                forms_1.Validators.minLength(6)
                            ]
                        ],
                        passwordConfirm: [
                            "", [
                                forms_1.Validators.required,
                                forms_1.Validators.minLength(6)
                            ]
                        ],
                        displayName: ["", null]
                    }, {
                        validator: this.compareValidator('password', 'passwordConfirm')
                    });
                    if (!this.isRegister) {
                        this.userForm.addControl("passwordCurrent", new forms_1.FormControl("", forms_1.Validators.required));
                        var password = this.userForm.find("password");
                        password.clearValidators();
                        password.setValidators(forms_1.Validators.minLength(6));
                        var passwordConfirm = this.userForm.find("passwordConfirm");
                        passwordConfirm.clearValidators();
                        passwordConfirm.setValidators(forms_1.Validators.minLength(6));
                        this.authService.get().subscribe(function (user) {
                            _this.userForm.find("username").setValue(user.UserName);
                            _this.userForm.find("email").setValue(user.Email);
                            _this.userForm.find("displayName").setValue(user.DisplayName);
                        });
                    }
                };
                UserEditComponent.prototype.compareValidator = function (fc1, fc2) {
                    return function (group) {
                        var password = group.controls[fc1];
                        var passwordConfirm = group.controls[fc2];
                        if (password.value === passwordConfirm.value) {
                            return null;
                        }
                        return { compareFailed: true };
                    };
                };
                UserEditComponent.prototype.onSubmit = function () {
                    var _this = this;
                    if (this.isRegister) {
                        this.authService.add(this.userForm.value)
                            .subscribe(function (data) {
                            if (data.error == null) {
                                // registration successful
                                _this.errorMessage = null;
                                _this.authService.login(_this.userForm.value.username, _this.userForm.value.password)
                                    .subscribe(function (data) {
                                    // login successful
                                    _this.errorMessage = null;
                                    _this.router.navigate([""]);
                                }, function (err) {
                                    console.log(err);
                                    // login failure
                                    _this.errorMessage =
                                        "Warning: Username or Password mismatch";
                                });
                            }
                            else {
                                // registration failure
                                _this.errorMessage = data.error;
                                console.log(_this.errorMessage);
                            }
                        }, function (err) {
                            // server/connection error
                            _this.errorMessage = err;
                            console.log(_this.errorMessage);
                        });
                    }
                    else {
                        var user = new user_1.User(this.userForm.value.username, this.userForm.value.password, this.userForm.value.passwordNew, this.userForm.value.email, this.userForm.value.displayName);
                        this.authService.update(user)
                            .subscribe(function (data) {
                            if (data.error == null) {
                                // update successful
                                _this.errorMessage = null;
                                _this.router.navigate([""]);
                            }
                            else {
                                // update failure
                                _this.errorMessage = data.error;
                                console.log(_this.errorMessage);
                            }
                        }, function (err) {
                            // server/connection error
                            _this.errorMessage = err;
                            console.log(_this.errorMessage);
                        });
                    }
                };
                return UserEditComponent;
            }());
            UserEditComponent = __decorate([
                core_1.Component({
                    selector: "user-edit",
                    template: "\n<div class=\"user-container\">\n    <form class=\"form-user\" [formGroup]=\"userForm\" (submit)=\"onSubmit()\">\n        <h2 class=\"form-user-heading\">{{title}}</h2>\n        <div class=\"form-group\">\n            <input [disabled]=\"!this.isRegister\" formControlName=\"username\" type=\"text\" class=\"form-control\" placeholder=\"Choose an Username\" autofocus />\n            <span class=\"validator-label valid\" *ngIf=\"this.userForm.controls.username.valid\">\n                <span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span>\n                valid!\n            </span>\n            <span class=\"validator-label invalid\" *ngIf=\"!this.userForm.controls.username.valid && !this.userForm.controls.username.pristine\">\n                <span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span>\n                invalid\n            </span>\n        </div>\n        <div class=\"form-group\">\n            <input formControlName=\"email\" type=\"text\" class=\"form-control\" placeholder=\"Type your e-mail address\" />\n            <span class=\"validator-label valid\" *ngIf=\"this.userForm.controls.email.valid\">\n                <span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span>\n                valid!\n            </span>\n            <span class=\"validator-label invalid\" *ngIf=\"!this.userForm.controls.email.valid && !this.userForm.controls.email.pristine\">\n                <span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span>\n                invalid\n            </span>\n        </div>\n        <div *ngIf=\"!this.isRegister\" class=\"form-group\">\n            <input formControlName=\"passwordCurrent\" type=\"password\" class=\"form-control\" placeholder=\"Current Password\" />\n            <span class=\"validator-label invalid\" *ngIf=\"!this.userForm.controls.passwordCurrent.valid\">\n                <span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span>\n                required\n            </span>\n        </div>\n        <div class=\"form-group\">\n            <input formControlName=\"password\" type=\"password\" class=\"form-control\" placeholder=\"Choose a Password\" />\n            <span class=\"validator-label valid\" *ngIf=\"this.userForm.controls.password.valid && !this.userForm.controls.password.pristine\">\n                <span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span>\n                valid!\n            </span>\n            <span class=\"validator-label invalid\" *ngIf=\"!this.userForm.controls.password.valid && !this.userForm.controls.password.pristine\">\n                <span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span>\n                invalid\n            </span>\n        </div>\n        <div class=\"form-group\">\n            <input formControlName=\"passwordConfirm\" type=\"password\" class=\"form-control\" placeholder=\"Confirm your Password\" />\n            <span class=\"validator-label valid\" *ngIf=\"this.userForm.controls.passwordConfirm.valid && !this.userForm.controls.password.pristine && !this.userForm.hasError('compareFailed')\">\n                <span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span>\n                valid!\n            </span>\n            <span class=\"validator-label invalid\" *ngIf=\"(!this.userForm.controls.passwordConfirm.valid && !this.userForm.controls.passwordConfirm.pristine) || this.userForm.hasError('compareFailed')\">\n                <span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span>\n                invalid\n            </span>\n        </div>\n        <div class=\"form-group\">\n            <input formControlName=\"displayName\" type=\"text\" class=\"form-control\" placeholder=\"Choose a Display Name\" />\n        </div>\n        <div class=\"form-group\">\n            <input type=\"submit\" class=\"btn btn-primary btn-block\" [disabled]=\"!userForm.valid\" value=\"{{this.isRegister ? 'Register' : 'Save'}}\" />\n        </div>\n    </form>\n</div>\n    "
                }),
                __metadata("design:paramtypes", [forms_1.FormBuilder, router_1.Router, auth_service_1.AuthService, router_1.ActivatedRoute])
            ], UserEditComponent);
            exports_1("UserEditComponent", UserEditComponent);
        }
    };
});