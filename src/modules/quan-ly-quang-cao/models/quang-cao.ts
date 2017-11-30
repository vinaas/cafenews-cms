import { ValidationRules } from 'aurelia-validation';
export class QuangCao {
  id: number;
  idQuangCao: string;
  tenChuongTrinh: string;
  motaChuongTrinh: string;
  ngayBatDau: Date;
  ngayKetThuc: Date;
  viTriQuangCao: Array<string>;
  scriptAds: string;
  lastModified: Date;
  lastUserId: number;

  constructor() { }

}

export const quangCaoValidationRules = ValidationRules
  .ensure((i: QuangCao) => i.tenChuongTrinh).required().withMessage('Trường này là bắt buộc')
  // .ensure(i => i.motaChuongTrinh).required().withMessage('Trường này là bắt buộc')
  // .ensure(i => i.ngayBatDau).required().withMessage('Trường này là bắt buộc')
  // .ensure(i => i.ngayKetThuc).required().withMessage('Trường này là bắt buộc')
  // .ensure(i => i.viTriQuangCao).required().withMessage('Trường này là bắt buộc')
  // .ensure(i => i.scriptAds).required().withMessage('Trường này là bắt buộc')

  .on(QuangCao).rules