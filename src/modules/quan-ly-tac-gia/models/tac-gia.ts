import { ValidationRules } from 'aurelia-validation';
export class TacGia {
  id: number
  idTacGia: string;
  tenTacGia: string
  password: string;
  soDienThoai: string
  ngayTao: Date = new Date()
  trangThai: string;
  realm: string;
  username: string;
  email: string;
  emailVerified: boolean;
  constructor() {
  }
}
// export const phongBanValidationRules = ValidationRules
// .ensure((i: TacGia) => i.username).required()
// .ensure(i => i.password).required()
// .on(TacGia).rules
