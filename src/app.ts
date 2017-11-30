import { PLATFORM } from 'aurelia-pal';
import { inject } from 'aurelia-dependency-injection';
import { Aurelia } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
export class App {
  router: Router;
  userInfo: any;
  constructor() {
  }
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Aurelia';

    config.map([
      {
        route: ['', 'login'], name: 'login', moduleId: PLATFORM.moduleName('./login'), nav: true, title: 'login',
        settings: { icon: 'pg-home' }
      },
      {
        route: 'admin', name: 'admin', moduleId: PLATFORM.moduleName('./modules/admin/admin'), nav: true, title: 'admin',
        settings: { icon: 'pg-tables' }
      },

    ]);

    this.router = router;

  }
}


