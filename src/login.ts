import { AuthenService, UserCredential } from './authen/authenService';
import swal from 'sweetalert';
import { STORAGE } from './helpers/storage';
import { Aurelia, inject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { PLATFORM } from "aurelia-pal";
@inject(Aurelia, Router, AuthenService)

export class Login {
  userCredential: UserCredential;
  constructor(private aurelia: Aurelia, private router: Router, private authSrv: AuthenService) {
    if (authSrv.isAuthenticated)
      this.router.navigateToRoute('admin')
  };
  login() {
    console.log(this.userCredential.username)
    this.authSrv.login(this.userCredential).then(value => {
      if (value) {
        this.router.navigateToRoute('admin')
      }
      else
        this.showError("Tài khoản không đúng");
    }).catch(e => {
      this.showError(e.message);
    })
  }
  private showError(err) {
    PLATFORM.global.swal("Đăng nhập không thành công", `${err}`, "error");
  }
}
