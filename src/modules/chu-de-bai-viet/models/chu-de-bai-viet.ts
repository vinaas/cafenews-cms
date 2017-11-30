import { ValidationRules } from 'aurelia-validation';
export class ChuDeBaiViet {
  id: number
  // ngayTao: Date = new Date();
  slug: string;
  date: Date = new Date();
  // moTa: string;
  tenChuDe: string;
  constructor() {
  }
}
export const newChuDeValidationRules = ValidationRules
  .ensure((i: ChuDeBaiViet) => i.tenChuDe).required()
  .ensure((i: ChuDeBaiViet) => i.slug).required()
  .on(ChuDeBaiViet).rules
