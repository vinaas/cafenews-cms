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

export class InsertOrUpdateNhanVien {

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

  get getTieuDe() {
    if (this.item.id) return "Cập nhật";
    return "Thêm mới";
  }

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

  runFilter(): any {
    throw new Error("Method not implemented.");
  }

  async runCreateTaiLieu() {
    //torun gan select tu dialog tra ve
    this.selectedItem = new TaiLieu()
    this.dialogService.open({ viewModel: InsertOrUpdateTaiLieu, model: this.selectedItem }).whenClosed((result) => {
      if (!result.wasCancelled) {
        this.selectedItem = result.output;
        this.taiLieuSrv.Post(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
      } else {
        logger.info("Cancel");
      }
    });
    logger.info("runCreateTaiLieu()", this.selectedItem)
    //this.taiLieuSrv.Post(this.selectedItem)
  }

  async runUpdateTaiLieu(items) {
    //torun gan select tu dialog tra ve
    this.selectedItem = items
    logger.info("runUpdateTaiLieu()", this.selectedItem)
    this.dialogService.open({ viewModel: InsertOrUpdateTaiLieu, model: this.selectedItem }).whenClosed((result) => {
      if (!result.wasCancelled) {
        this.selectedItem = result.output;
        this.taiLieuSrv.Put(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
      } else {
        logger.info("Cancel");
      }
    });
    this.taiLieuSrv.Put(this.selectedItem)
  }

  save() {
    logger.info('item', this.item)
    this.validationcontroller.validate({ object: this.item, rules: nhanVienValidationRules }).then((result) => {
      logger.info('result.valid', result.valid)
      if (result.valid) {
        this.ctrl.ok(this.item);
      }
    })

  }
  private showSuccess() {
    PLATFORM.global.swal("Thành công", "Thực hiện thành công", "success");
  }

  private showError(err) {
    PLATFORM.global.swal("Không thành công", `${err}`, "error");
  }

  private showCancel() {
    PLATFORM.global.swal("Đã hủy", "Đã hủy thao tác", "warning");
  }

  private confirm(cb) {
    PLATFORM.global.swal({
      title: "Are you sure?",
      text: "You will not be able to recover this imaginary file!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel plx!",
      closeOnConfirm: false,
      closeOnCancel: false
    },
      function (isConfirm) {
        cb(isConfirm)
      })
}
}
