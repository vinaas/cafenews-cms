import {
  PLATFORM
} from 'aurelia-pal';
export class STORAGE {
  static readonly tokenKey: string = 'authenToken';
  static readonly userInfoKey: string = 'userInfo';
  constructor() {

  }

  get(key: string): string {

    let data = PLATFORM.global['localStorage'].getItem(key);
    return JSON.parse(data) || undefined;
  }

  set(key: string, value: any) {
    let data = JSON.stringify(value);
    PLATFORM.global['localStorage'].setItem(key, data) || undefined;
  }

  remove(key: string) {
    PLATFORM.global['localStorage'].removeItem(key);
  }
}
