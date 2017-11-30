import { ValidationRules } from 'aurelia-validation';
import { NhanVien } from './nhan-vien';
export class PhongBan {
  id: number
  // PHÒNG BAN
  description: number
  name: string
  created: Date;
  modified: Date;
  nhanvien:NhanVien[];
  constructor() {
  }
}
export const phongBanValidationRules = ValidationRules
  .ensure((i: PhongBan) => i.description).required()
  .ensure(i => i.name).required()
  .on(PhongBan).rules
