import { AuthenService } from './../../authen/authenService';
import { inject } from 'aurelia-framework';
import { noView } from "aurelia-templating";
@noView
@inject(AuthenService)
export class Logout {
    constructor(private authSrv: AuthenService) {
        this.authSrv.logout();
    }
}