import { logger } from './../../quan-ly-user/logger';
import { TaiLieu } from './../models/tai-lieu';
import { TaiLieuService, FakeTaiLieuServiceImpl} from '../services/tai-lieu-service'
import { NhanVien, nhanVienValidationRules } from './../models/nhan-vien';
import { BootstrapFormRenderer } from './../../../helpers/bootstrap-form-renderer';
import { inject } from 'aurelia-framework';
import { DialogController } from "aurelia-dialog";
import { ValidationControllerFactory, ValidationController } from "aurelia-validation";
import { DialogService } from "aurelia-dialog";
import { PLATFORM } from 'aurelia-pal';
import { InsertOrUpdateTaiLieu } from './update-tai-lieu-dialog';
import { PhongBan } from '../models/phong-ban';
import { PhongBanServiceImpl, PhongBanService} from '../services/phong-ban-service'
@inject(DialogController, ValidationControllerFactory, DialogService, FakeTaiLieuServiceImpl, PhongBanServiceImpl)

export class InsertOrViewNhanVien {
  validationcontroller: ValidationController;
  constructor(private ctrl: DialogController, private controllerFactory,  private dialogService: DialogService, private taiLieuSrv: TaiLieuService, private phongBanSrv: PhongBanServiceImpl) {
    this.validationcontroller = controllerFactory.createForCurrentScope();
    this.validationcontroller.addRenderer(new BootstrapFormRenderer());
  }

  item: NhanVien;
  items: TaiLieu[];
  itemdepartment: PhongBan;
  department: PhongBan[];
  selectedItem: TaiLieu;

  async activate(dto: NhanVien) {
    this.item = dto
    let sefl = this;
    await Promise.all([
      
      //this.bvSer.GetAll().then(rec => sefl.itemBaiViet = rec),
      this.phongBanSrv.GetAll().then(rs => this.department = rs).catch(err=>console.log(err)) ,
      this.taiLieuSrv.GetAll().then(rs => this.items = rs).catch(err=>console.log(err)) 
    ]);
    // sau này có filter từ api thì xóa dòng này, thay bằng filter
    for (var i =(this.items.length-1); i >=0 ; i--) {
      if(this.items[i].nhanVienid != this.item.id)
        this.items.splice(i,1);
      
    }
    logger.info('NhanVien dto', dto);
    logger.info('tai lieu dto', this.items);
    // this.phongBanDto = dto;
  }
}
