import { PLATFORM } from 'aurelia-pal';
import { bindable, inject } from 'aurelia-framework';
@inject(Element)
export class LoaderCustomElement {
    @bindable loading
    @bindable asyncTask
    /**
     *
     */
    constructor(private el:Element) {
    }
    async asyncTaskChanged() {

        if (typeof this.asyncTask.then == 'function') {
            PLATFORM.global.$(this.el.children[1].firstElementChild).fadeIn(200)
            await this.asyncTask
            PLATFORM.global.$(this.el.children[1].firstElementChild).fadeOut(200)
        }

    }
}
