import { PLATFORM } from 'aurelia-pal';
import {  bindable,  bindingMode,  inject,  customAttribute} from 'aurelia-framework';
const $ = PLATFORM.global.$
@inject(Element)

@customAttribute('datepicker')

export class DatepickterCustomAttribute {
  element: any;
  constructor(element) {
    this.element = element;
  }
  attached() {
    $(this.element).datepicker()
      .on('changeDate', (e) => {
        this.element.dispatchEvent(new Event('change'));
      })
  }
  detached() {
    $(this.element).datepicker('destroy');
  }


}
