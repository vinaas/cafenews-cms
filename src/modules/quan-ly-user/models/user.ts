import { ValidationRules } from 'aurelia-validation';
export class User {
  id: number
  username: string;
  password: string;
  emailVerified: boolean;
  email: string;
  soDienThoai: number;
  tenNhanVien: string;
  gioiTinh: string;
  maNhanVien: string;
  diaChi: string;
  ngaySinh: Date;

  constructor() {
  }
}

export const userValidationRules = ValidationRules
  .ensure((i: User) => i.username).required().withMessage('Trường này là bắt buộc')
  // .ensure((i: User) => i.password).required().withMessage('Trường này là bắt buộc')
  .ensure((i: User) => i.email).required().email().withMessage('Email chưa đúng định dạng')
  // .ensure((i: User) => i.tenNhanVien).required().withMessage('Trường này là bắt buộc')
  // .ensure((i: User) => i.gioiTinh).required().withMessage('Trường này là bắt buộc')
  // .ensure((i: User) => i.maNhanVien).required().withMessage('Trường này là bắt buộc')
  // .ensure((i: User) => i.diaChi).required().withMessage('Trường này là bắt buộc')
  // .ensure((i: User) => i.ngaySinh).required().withMessage('Trường này là bắt buộc')
  // .ensure((i: User) => i.soDienThoai).required().withMessage('Trường này là bắt buộc')
   .on(User).rules
