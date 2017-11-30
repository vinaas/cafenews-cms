import { PLATFORM } from 'aurelia-pal';
import {  bindable,  bindingMode,  inject,  customAttribute} from 'aurelia-framework';
const $ = PLATFORM.global.$
@inject(Element)

@customAttribute('daterangepickter')

export class DaterangepickterCustomAttribute {
  element: any;
  constructor(element) {
    this.element = element;
  }
  attached() {
    $(this.element).datepicker()
  }
  detached() {
    $(this.element).datepicker('destroy');
  }

}
