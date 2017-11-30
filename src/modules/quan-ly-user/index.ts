import { PLATFORM } from 'aurelia-pal';
import { childViewer } from './../../helpers/child-viewer';
import { inlineView } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { Router, RouterConfiguration } from 'aurelia-router';
import { logger } from "./logger";
@inlineView(childViewer)
export class QuanLyNhanVien {
    router: Router;
    heading = 'Quản lý user';
    configureRouter(config: RouterConfiguration, router: Router) {
        config.map([
            { route: ['', 'danh-sach-user'], name: 'danh-sach-user', moduleId: PLATFORM.moduleName('./danh-sach-user'), nav: true, title: 'Danh sách user' }]);
        this.router = router;
        logger.debug('router', this.router)
    }
}
