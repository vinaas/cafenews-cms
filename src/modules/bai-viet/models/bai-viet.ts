import { ValidationRules } from 'aurelia-validation';
import { TacGia } from '../../quan-ly-tac-gia/models/tac-gia';
import { ChuyenMucBaiViet } from '../../chuyen-muc-bai-viet/models/chuyen-muc-bai-viet';
import {observable} from 'aurelia-framework';
import { Helper} from './../../../resources/base/helper';
export class BaiViet {
  id: number
  title: string;
  @observable titles:string;
  // tacGia: string;
  layout: string;
  category: string;
  ngayDuyet: Date = new Date();
  ngayDang: Date = new Date();
  
  date: Date = new Date();
  userId : string;

  slug: string;
  "ghi-chu-anh-dai-dien": string;
  result: any;
  "mo-ta-ngan": string;
  tags: string;
  "__content__": any;
  trangThai: string;
  tenTrangThai : string;
  tieuDiem: number;
  nhomBaiViet: string  
  nguonBaiVietUrl: string; 
  modifiedUserId: string;
  modifiedDate : Date;
  modifiedNotes: string;
  approveUserId: string;
  approveDate: Date;
  approveNotes: string;
  unApproveUserId: string;
  unApproveDate: Date;
  unApproveNotes: string;
  publishUserId : string;
  publishDate : Date;
  publishNotes : string;
  unPublishUserId: string;
  unPublishDate: Date;
  unPushishNotes: string;
  nhuanBut : number;
  idTacGia : string;
  dangTrenBao: PublicWebsite[];
  baiVietLienQuan: string [];
  baiVietCoTheQuanTam: string[];
    
  loaiBaiViet : string; 
  websiteId : string;
  reviewPoint : number; 

  constructor() {
    this.layout = "trang-chi-tiet.html"
    this.tieuDiem = 0;
  }
  
  titlesChanged(){
    this.title = this.titles;
    this.slug = Helper.generateSlug(this.titles);
  }
  
}

export const newBaiVietValidationRules = ValidationRules
  .ensure((i: BaiViet) => i.title).required()
  .ensure((i:BaiViet) => i.slug).required()
  // .ensure((i: BaiViet) => i.category).required()
  // .ensure((i: BaiViet) => i.tacGia).required()
  .on(BaiViet).rules

export class PublicWebsite {
  websiteName : string;
  websiteId : string;
  category : string;
  tags : string []; 
  notes: string;
}