import { PLATFORM } from 'aurelia-pal';
import { childViewer } from './../../helpers/child-viewer';
import { inlineView } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { Router, RouterConfiguration } from 'aurelia-router';
import { logger } from "./logger";
@inlineView(childViewer)
export class QuanLyQuangCao {
    router: Router;
    heading = 'Quản lý quảng cáo';
    configureRouter(config: RouterConfiguration, router: Router) {
        config.map([
            { route: ['', 'danh-sach-quang-cao'], name: 'danh-sach-quang-cao', moduleId: PLATFORM.moduleName('./danh-sach-quang-cao'), nav: true, title: 'Danh sách quảng cáo' }]);
        this.router = router;
        logger.debug('router', this.router)
    }
}
