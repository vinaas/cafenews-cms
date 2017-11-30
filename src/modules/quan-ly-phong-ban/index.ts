import { PLATFORM } from 'aurelia-pal';
import { childViewer } from './../../helpers/child-viewer';
import { inlineView } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { Router, RouterConfiguration } from 'aurelia-router';
import { logger } from "./logger";
@inlineView(childViewer)

export class DanhSachPhongBan {
  router: Router;
  heading = 'QUẢN LÝ PHÒNG BAN';
  configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      { route: ['', 'danh-sach-phong-ban'], name: 'danh-sach-phong-ban', moduleId: PLATFORM.moduleName('./danh-sach-phong-ban'), nav: true, title: 'Danh sách phòng ban' },
      { route: [ 'danh-sach-nhan-vien'], name: 'danh-sach-nhan-vien', moduleId: PLATFORM.moduleName('./danh-sach-nhan-vien'), nav: true, title: 'Danh sách nhân viên' }
      ]);
    this.router = router;
    logger.debug('router', this.router)
  }
}
