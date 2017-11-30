import { PLATFORM } from 'aurelia-pal';
import { NhanVien } from './models/nhan-vien';
import { FakeNhanVienServiceImpl, NhanVienService } from './services/nhan-vien-service';
import { Filter } from './../../resources/base/filter-base';
import { ViewModelBase } from './../../resources/base/viewmodel-base';
import { inject } from 'aurelia-framework';
import { logger } from "./logger";
import { DialogService } from "aurelia-dialog";
import { InsertOrUpdateNhanVien } from './dialogs/update-nhan-vien-dialog';
import { InsertOrViewNhanVien } from './dialogs/view-nhan-vien-dialog';
import { InsertOrChuyenPhongBan } from './dialogs/chuyen-phong-ban-dialog';
import { PhongBan } from './models/phong-ban';
import { PhongBanServiceImpl, PhongBanService} from './services/phong-ban-service'
@inject(FakeNhanVienServiceImpl, DialogService, PhongBanServiceImpl)
export class DanhSachNhanVien implements ViewModelBase {
    items: NhanVien[];
    itemsCount: number;
    phongban: PhongBan[];
    selectedItem: NhanVien;
    selectedList: NhanVien[];
    filter: Filter = { skip: 0, limit: 10, where: {} };
    asyncTask // task control waiting view

    constructor(private nhanVienSrv: NhanVienService, private dialogService: DialogService, private phongBanSrv: PhongBanService) {
    }

    async activate(params, routeConfig, navigationInstruction) {
        await this.runFilter()
    }

    async paginationChanged(event) {
        await this.runFilter()
    }

    async runFilter() {
      logger.info('runFilter', this.filter)
      await (this.asyncTask = Promise.all([
        this.nhanVienSrv.GetAll(this.filter).then(rec => this.items = rec),
        this.nhanVienSrv.GetCount(this.filter).then(rec => this.itemsCount = rec),
        this.phongBanSrv.GetAll(this.filter).then(rec => this.phongban = rec)
        // this.timerDo(1000) 
      ]))
    }

    timerDo(ms = 0) {
      return new Promise((resolve, reject) => { setTimeout(() => { resolve(true) }, ms) });
    }

    async runCreate() {
      //torun gan select tu dialog tra ve
      this.selectedItem = new NhanVien()
      this.dialogService.open({ viewModel: InsertOrUpdateNhanVien, model: this.selectedItem }).whenClosed((result) => {
        if (!result.wasCancelled) {
          this.selectedItem = result.output;
          this.nhanVienSrv.Post(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
        } else {
          logger.info("Cancel");
        }
      });
      logger.info("runCreate()", this.selectedItem)
      //this.nhanVienSrv.Post(this.selectedItem)
    }

    async runUpdate(item) {
      //torun gan select tu dialog tra ve
      this.selectedItem = item
      logger.info("runUpdate()", this.selectedItem)
      this.dialogService.open({ viewModel: InsertOrUpdateNhanVien, model: this.selectedItem }).whenClosed((result) => {
        if (!result.wasCancelled) {
          this.selectedItem = result.output;
          this.nhanVienSrv.Put(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
        } else {
          logger.info("Cancel");
        }
      });
      this.nhanVienSrv.Put(this.selectedItem)
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

    async runChuyenPhongBan(item) {
      //torun gan select tu dialog tra ve
      this.selectedItem = item
      logger.info("runChuyenPhongBan()", this.selectedItem)
      this.dialogService.open({ viewModel: InsertOrChuyenPhongBan, model: this.selectedItem }).whenClosed((result) => {
        if (!result.wasCancelled) {
          this.selectedItem = result.output;
          this.nhanVienSrv.Put(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
        } else {
          logger.info("Cancel");
        }
      });
      this.nhanVienSrv.Put(this.selectedItem)
    }

    async runDelete(item) {
      logger.info("runDelete()", item)
      await
        this.confirm(result => {
          if (result) this.nhanVienSrv.Delete(item.id).then(_ => this.showSuccess()).then(_ => this.runFilter())
          else this.showCancel()
        })
    }

    async runDeleteMany() {
      logger.info("runDeleteList()", this.selectedList)
      this.confirm(result => {
      })
      let deletedIds = this.selectedList.map(x => x.id);
      await this.nhanVienSrv.DeleteMany(deletedIds)
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
