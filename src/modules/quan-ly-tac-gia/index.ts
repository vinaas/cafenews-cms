import { PLATFORM } from 'aurelia-pal';
import { childViewer } from './../../helpers/child-viewer';
import { inlineView } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { Router, RouterConfiguration } from 'aurelia-router';
import { logger } from "./logger";
@inlineView(childViewer)
export class QuanLyTacGia {
    router: Router;
    heading = 'Quản lý tác giả';
    configureRouter(config: RouterConfiguration, router: Router) {
        config.map([
            { route: ['', 'danh-sach-tac-gia'], name: 'danh-sach-tac-gia', moduleId: PLATFORM.moduleName('./danh-sach-tac-gia'), nav: true, title: 'Danh sách tác giả' }]);
        this.router = router;
        logger.debug('router', this.router)
    }
}
