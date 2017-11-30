import { PLATFORM } from 'aurelia-pal';
import { element } from 'aurelia-protractor-plugin/protractor';
import { bindable, bindingMode, inject, customAttribute } from 'aurelia-framework';
import 'select2';
@inject(Element)
@customAttribute('select2')

export class Select2CustomAttribute {

  constructor(private element) {
  }
  async attached() {
    PLATFORM.global.$(this.element).select2()
      .on('select2:select', (e) => {
        this.element.dispatchEvent(new Event('change'));
      })

  }
  detached() {
    PLATFORM.global.$(this.element).select2('destroy');
  }

}

