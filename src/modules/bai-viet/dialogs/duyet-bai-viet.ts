import { BaiViet, newBaiVietValidationRules, PublicWebsite } from './../models/bai-viet';
import { logger } from './../logger';
import { BootstrapFormRenderer } from './../../../helpers/bootstrap-form-renderer';
import { inject } from 'aurelia-framework';
import { DialogController } from "aurelia-dialog";
import { ValidationControllerFactory, ValidationController } from "aurelia-validation";
import { IBaiVietService, BaiVietService } from '../services/bai-viet-service';

import { ChuyenMucBaiViet } from '../../chuyen-muc-bai-viet/models/chuyen-muc-bai-viet';
import { ChuyenMucService, ChuyenMucBaiVietServiceImpl } from '../../chuyen-muc-bai-viet/services/chuyen-muc-service';

@inject(DialogController, ValidationControllerFactory, BaiVietService, ChuyenMucBaiVietServiceImpl)

export class DuyetBaiViet {
  validationcontroller: ValidationController;
  constructor(private ctrl: DialogController, private controllerFactory,  private bvSer:BaiVietService,
    private ChuyenMucSrv: ChuyenMucService) {
    this.validationcontroller = controllerFactory.createForCurrentScope();
    this.validationcontroller.addRenderer(new BootstrapFormRenderer());
  }
  get getTieuDe() {
    if (this.item.id) return "Cập nhật";
    return "Thêm mới";
  }

  item: BaiViet;
  itemBaiViet: BaiViet[];
  dsChuyenMuc : ChuyenMucBaiViet[];
  tenBao : string; 
  chuyenMucBao: string; 
  ghiChu : string;

  dsBaoDang : PublicWebsite[]; 

  async activate(dto: BaiViet) {
    this.item = dto;
    let sefl = this;
    await Promise.all([
     // this.bvSer.GetAll().then(rec=>sefl.itemBaiViet = rec)
      this.ChuyenMucSrv.GetAll().then(rs => sefl.dsChuyenMuc = rs)
    ]);
    this.dsBaoDang = new Array<PublicWebsite>();
    logger.info('BaiViet dto', dto);
  }
  
  save() {
    logger.info('item', this.item)
    this.validationcontroller.validate({ object: this.item, rules: newBaiVietValidationRules }).then((result) => {
      if (result.valid) {
        logger.info('result.valid', result.valid)
        this.item.dangTrenBao = this.dsBaoDang;
        this.ctrl.ok(this.item);
      }
    })
  }

  private GetTenChuyenMuc(category: string) : string 
  {
       let tenChuyenMuc: string = "";
       this.dsChuyenMuc.forEach(item => {
          if (item.chuyenMuc == category)
            tenChuyenMuc = item.displayName
       });
       if (tenChuyenMuc == "")
          tenChuyenMuc = category;  //gán tạm giá trị maChuyenMuc
       return tenChuyenMuc;  
  }
  
  addToDsBaoDang() {
    logger.info('ten bao', this.tenBao)
    var baoDang = new PublicWebsite();
    baoDang.websiteId = this.tenBao;
    baoDang.websiteName = this.tenBao;
    baoDang.category = this.chuyenMucBao;
    baoDang.notes = this.ghiChu;
    console.log("them bao", baoDang);
    var found = false;
    if (!this.dsBaoDang.find(obj => obj.websiteId == this.tenBao)){
      this.dsBaoDang.push(baoDang);
    }
    return;
  }

  removeFromDsBaoDang(item : PublicWebsite){
    //TODO : this.dsBaoDang.
  }

  enablePublishButton(): boolean{
      return this.dsBaoDang.length > 0;
  }

}
