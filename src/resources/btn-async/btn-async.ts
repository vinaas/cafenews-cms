import { PLATFORM } from 'aurelia-pal';
import { bindable, bindingMode, inject, customAttribute } from 'aurelia-framework';
@inject(Element)
@customAttribute('btn-async')

export class BtnAsyncAttribute {
  element: Element;
  @bindable task;
  constructor(element) {
    this.element = element; //button
  }
  attached() {
    this.element.addEventListener('click', async () => {
      var $this = PLATFORM.global.$(this.element);
      $this.button('loading');
      await this.task();
      $this.button('reset');
    });

  }
  detached() { }

}
