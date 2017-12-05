import { AuthenService } from './../../authen/authenService';
import { PLATFORM } from 'aurelia-pal';

import { inject } from 'aurelia-dependency-injection';
import { Aurelia } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import "../../helpers/loggingSetting";
import "../../helpers/axiosClient"
// import "../../helpers/axiosInterceptor";
@inject(AuthenService, Router)
export class App {
  router: Router;
  userInfo: any;
  constructor(private authenSrv: AuthenService, router:Router) {
    this.userInfo = this.authenSrv.userInfo;
    if (!authenSrv.isAuthenticated)
      router.navigateToRoute('login');
  }

  enableAdminNav() : boolean {
    if (this.authenSrv.userInfo === undefined)
      return false;
    let adminList : string[] = ['admin', 'admin01', 'admin02']
    if (adminList.includes(this.authenSrv.userInfo.userName) ){
      return true;
    }
    return false;
  }
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'CMS VinaAS';
    config.map([
      {
        route: ['','ds-quiz'], name: 'ds-quiz', moduleId: PLATFORM.moduleName('../quizs/ds-quiz'), nav: true,
        settings: { icon: 'pg-tables' }
      },
      {
        route: 'listQuestion', name: 'listQuestion', moduleId: PLATFORM.moduleName('../questions/listQuestion'), nav: true,
        settings: { icon: 'pg-tables' }
      },
      {
        route: 'quan-ly-user', name: 'quan-ly-user', moduleId: PLATFORM.moduleName('../quan-ly-user/index'), nav: true, title: 'Quản lý user',
        settings: { icon: 'pg-tables' }
      },
    ]);

    this.router = router;

  }
  attached() {
    var script = document.createElement("script");
    script.src = "assets/scripts.js";
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  runLogout(){
    this.authenSrv.logout();
  }

}
