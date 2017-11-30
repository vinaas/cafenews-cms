import { PLATFORM } from 'aurelia-pal';
import { childViewer } from './../../helpers/child-viewer';
import { inlineView } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { Router, RouterConfiguration } from 'aurelia-router';
import { logger } from "./logger";
@inlineView(childViewer)
export class ChuDeBaiViet {
    router: Router;
    // heading = 'Bài viết';
    configureRouter(config: RouterConfiguration, router: Router) {
        config.map([
            { route: ['', 'chu-de'], name: 'chu-de', moduleId: PLATFORM.moduleName('./chu-de'), nav: true}
          ]);
        this.router = router;
        logger.debug('router', this.router)
    }
}
