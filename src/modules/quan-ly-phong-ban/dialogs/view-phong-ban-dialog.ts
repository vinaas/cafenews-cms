import { DialogService } from 'aurelia-dialog';
import { logger } from './../logger';
import { BootstrapFormRenderer } from './../../../helpers/bootstrap-form-renderer';
import { inject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { ValidationControllerFactory, ValidationController } from "aurelia-validation";
import { PhongBan } from '../models/phong-ban';
import { NhanVien } from '../models/nhan-vien';
import { Filter } from '../../../resources/base/filter-base';
import { PhongBanService, PhongBanServiceImpl } from '../services/phong-ban-service';
import { NhanVienService, FakeNhanVienServiceImpl } from '../services/nhan-vien-service';
import { PLATFORM } from 'aurelia-pal';
import { InsertOrViewNhanVien } from './view-nhan-vien-dialog';
@inject(DialogController, ValidationControllerFactory, PhongBanServiceImpl, FakeNhanVienServiceImpl, DialogService)

export class InsertOrViewPhongBan {
  items: PhongBan[];
  itemsNhanVien: NhanVien[];
  itemPhongBan: PhongBan;
  itemsCount: number
  selectedItem: PhongBan;
  selectedList: PhongBan[];
  filter: Filter = { skip: 0, limit: 10, where: {} };
  asyncTask // task control waiting view

  validationcontroller: ValidationController;
  constructor(private ctrl: DialogController, private controllerFactory, private PhongBans: PhongBanService, private nhanVienSrv: NhanVienService, private dialogService: DialogService) {
    PLATFORM.moduleName('./view-phong-ban-dialog')
    this.validationcontroller = controllerFactory.createForCurrentScope();
    this.validationcontroller.addRenderer(new BootstrapFormRenderer());
  }

  async activate(dto: PhongBan) {
    this.itemPhongBan = dto
    // this.PhongBans = await this.PhongBans.GetAll();
    await this.runFilter()
    logger.info('dto', dto);
    logger.info('ViewPhongBan', this.PhongBans)
    // this.item = dto;
  }

  async paginationChanged(event) {
    await this.runFilter()
  }

  async runFilter() {
    logger.info('runFilter', this.filter)
    await (this.asyncTask = Promise.all([
      this.PhongBans.GetAll(this.filter).then(rec => this.items = rec),
      this.PhongBans.GetCount(this.filter).then(rec => this.itemsCount = rec),
      this.nhanVienSrv.GetAll().then(rec => this.itemsNhanVien = rec),
    ]));
    console.log(this.itemsNhanVien)
  }

  async runView(item) {
    //torun gan select tu dialog tra ve
    this.selectedItem = item
    logger.info("runView()", this.selectedItem)
    this.dialogService.open({ viewModel: InsertOrViewNhanVien, model: this.selectedItem }).whenClosed((result) => {
      if (!result.wasCancelled) {
        this.selectedItem = result.output;
        this.nhanVienSrv.Put(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
      } else {
        logger.info("Cancel");
      }
    });
    this.nhanVienSrv.Put(this.selectedItem)
  }

  timerDo(ms = 0) {
    return new Promise((resolve, reject) => { setTimeout(() => { resolve(true) }, ms) });
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
