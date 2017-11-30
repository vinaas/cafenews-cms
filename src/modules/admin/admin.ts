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
    if (this.authenSrv.userInfo.userName === undefined)
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
        route: 'tao-bai-viet', name: 'tao-bai-viet', moduleId: PLATFORM.moduleName('../bai-viet/tao-bai-viet'), nav: true,
        settings: { icon: 'pg-tables' }
      },
      {
        route: 'ds-bai-viet', name: 'ds-bai-viet', moduleId: PLATFORM.moduleName('../bai-viet/ds-bai-viet'), nav: true,
        settings: { icon: 'pg-tables' }
      },
      {
        route: 'ds-bai-viet-cho-duyet', name: 'ds-bai-viet-cho-duyet', moduleId: PLATFORM.moduleName('../bai-viet/ds-bai-viet-cho-duyet'), nav: true,
        settings: { icon: 'pg-tables' }
      },
      {
        route: 'ds-bai-viet-cho-dang', name: 'ds-bai-viet-cho-dang', moduleId: PLATFORM.moduleName('../bai-viet/ds-bai-viet-cho-dang'), nav: true,
        settings: { icon: 'pg-tables' }
      },
      {
        route: 'ds-bai-viet-tieu-diem', name: 'ds-bai-viet-tieu-diem', moduleId: PLATFORM.moduleName('../bai-viet/ds-bai-viet-tieu-diem'), nav: true,
        settings: { icon: 'pg-tables' }
      },
      {
        route: 'ds-bai-viet-da-dang', name: 'ds-bai-viet-da-dang', moduleId: PLATFORM.moduleName('../bai-viet/ds-bai-viet-da-dang'), nav: true,
        settings: { icon: 'pg-tables' }
      },
      {
        route: ['', 'dashboard'], name: 'dashboard', moduleId: PLATFORM.moduleName('../dashboard/index'), nav: true, title: 'Dashboard',
        settings: { icon: 'pg-home' }
      },

      {
        route: 'quan-ly-user', name: 'quan-ly-user', moduleId: PLATFORM.moduleName('../quan-ly-user/index'), nav: true, title: 'Quản lý user',
        settings: { icon: 'pg-tables' }
      },

      {
        route: 'quan-ly-tac-gia', name: 'quan-ly-tac-gia', moduleId: PLATFORM.moduleName('../quan-ly-tac-gia/index'), nav: true, title: 'Quản lý tác giả',
        settings: { icon: 'pg-tables' }
      },

      {
        route: 'quan-ly-quang-cao', name: 'quan-ly-quang-cao', moduleId: PLATFORM.moduleName('../quan-ly-quang-cao/index'), nav: true, title: 'Quản lý quảng cáo',
        settings: { icon: 'pg-tables' }
      },

      {
        route: 'chu-de-bai-viet', name: 'chu-de-bai-viet', moduleId: PLATFORM.moduleName('../chu-de-bai-viet/index'), nav: true,
        settings: { icon: 'pg-tables' }
      },

      {
        route: 'chuyen-muc-bai-viet', name: 'chuyen-muc-bai-viet', moduleId: PLATFORM.moduleName('../chuyen-muc-bai-viet/index'), nav: true,
        settings: { icon: 'pg-tables' }
      }
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
