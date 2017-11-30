import { PLATFORM } from 'aurelia-pal';
import { childViewer } from './../../helpers/child-viewer';
import { inlineView } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { Router, RouterConfiguration } from 'aurelia-router';
import { logger } from "./logger";
@inlineView(childViewer)
export class ChuyenMucBaiViet {
    router: Router;
    // heading = 'Bài viết';
    configureRouter(config: RouterConfiguration, router: Router) {
        config.map([
            { route: ['', 'chuyen-muc'], name: 'chuyen-muc', moduleId: PLATFORM.moduleName('./chuyen-muc'), nav: true},
          ]);
        this.router = router;
        logger.debug('router', this.router)
    }
}
