import { ValidationRules } from 'aurelia-validation';
export class ChuyenMucBaiViet {
  id: number
  category: string;
  ngayTao: Date = new Date();
  maChuyenMuc: string;
  chuyenMuc: string;
  chuyenMucCha: string;
  slug: string;
  moTa: string;
  
  sortBy: string;
  displayName: string;
  perPage: number;
  layout: string;
  first: string;
  path: string;

  /*{

   "sortBy": "date",
  "displayName": "Thời Sự",
  "perPage": 10,
  "layout": "defaut.category.html",
  "first": "string",
  "path": "string",
  "chuyenMuc": "thoi-su",
  "maChuyenMuc": "thoi-su",
  "chuyenMucCha": "root",
  "slug": "thoi-su",
  "moTa": "string",
  "ngayTao": "2017-09-15T14:09:20.513Z"
}
 */
  constructor() {
    this.chuyenMucCha = "root";
    this.sortBy = "date";
    this.perPage = 10;
    this.layout = "default.category.html";  
  }
}

export const newChuyenMucValidationRules = ValidationRules
  .ensure((i: ChuyenMucBaiViet) => i.chuyenMuc).required()
  .ensure((i: ChuyenMucBaiViet) => i.chuyenMucCha).required()
  .on(ChuyenMucBaiViet).rules
