import { ValidationRules } from 'aurelia-validation';
import { TaiLieu } from './tai-lieu';
import { User } from '../../quan-ly-user/models/user';
import { PhongBan } from './phong-ban';
export class NhanVien {
  id: number
  // NHÂN VIÊN
  tenNhanVien: string;
  maNhanVien: string;
  chucVu: string;
  phongbanid: number;
  PhongBan: PhongBan;
    // chi tiết
    honNhan: boolean;
    gioiTinh: boolean;
    soDienThoai: string;
    soLienLacKhanCap: string;
    email: string;
    lienHe: string;
    ghiChu: string;
    taiLieu: TaiLieu[];
  constructor() {
  }
}

export const nhanVienValidationRules = ValidationRules
  .ensure((i: NhanVien) => i.tenNhanVien).required()
  .ensure(i => i.maNhanVien).required()
  .on(NhanVien).rules
