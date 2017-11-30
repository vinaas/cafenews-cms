import { ValidationRules } from 'aurelia-validation';
import { NhanVien } from './nhan-vien';
export class TaiLieu {
  id: number

  tenTaiLieu: string;
  taiLieu: string;
  moTa: string;
  nhanVienid: number;
  nhanVien: NhanVien;

  constructor() {
  }
}
