import { PLATFORM } from 'aurelia-pal';
import { InsertOrUpdatePhongBan } from './dialogs/update-phong-ban-dialog';
import { PhongBan } from './models/phong-ban';
import { PhongBanServiceImpl, PhongBanService } from './services/phong-ban-service';
import { Filter } from './../../resources/base/filter-base';
import { ViewModelBase } from './../../resources/base/viewmodel-base';
import { inject } from 'aurelia-framework';
import { logger } from "./logger";
import { DialogService } from "aurelia-dialog";
import { InsertOrViewPhongBan } from './dialogs/view-phong-ban-dialog';
@inject(PhongBanServiceImpl, DialogService)
export class DanhSachPhongBan implements ViewModelBase {
    items: PhongBan[];
    itemsCount: number
    selectedItem: PhongBan;
    selectedList: PhongBan[];
    filter: Filter = { skip: 0, limit: 10, where: {} };
    asyncTask // task control waiting view

    constructor(private phongBanSrv: PhongBanService, private dialogService: DialogService) {
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
        this.phongBanSrv.GetAll(this.filter).then(rec => this.items = rec),
        this.phongBanSrv.GetCount(this.filter).then(rec => this.itemsCount = rec),
        // this.timerDo(1000) 
      ]))
    }

    timerDo(ms = 0) {
      return new Promise((resolve, reject) => { setTimeout(() => { resolve(true) }, ms) });
    }

    async runCreate() {
      //torun gan select tu dialog tra ve
      this.selectedItem = new PhongBan()
      this.dialogService.open({ viewModel: InsertOrUpdatePhongBan, model: this.selectedItem }).whenClosed((result) => {
        if (!result.wasCancelled) {
          this.selectedItem = result.output;
          this.phongBanSrv.Post(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
        } else {
          logger.info("Cancel");
        }
      });
      logger.info("runCreate()", this.selectedItem)
      //this.phongBanSrv.Post(this.selectedItem)
    }

    async runUpdate(item) {
      //torun gan select tu dialog tra ve
      this.selectedItem = item
      logger.info("runUpdate()", this.selectedItem)
      this.dialogService.open({ viewModel: InsertOrUpdatePhongBan, model: this.selectedItem }).whenClosed((result) => {
        if (!result.wasCancelled) {
          this.selectedItem = result.output;
          this.phongBanSrv.Put(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
        } else {
          logger.info("Cancel");
        }
      });
      this.phongBanSrv.Put(this.selectedItem)
    }

    async runView(item) {
      //torun gan select tu dialog tra ve
      this.selectedItem = item
      logger.info("runUpdate()", this.selectedItem)
      this.dialogService.open({ viewModel: InsertOrViewPhongBan, model: this.selectedItem }).whenClosed((result) => {
        if (!result.wasCancelled) {
          this.selectedItem = result.output;
          this.phongBanSrv.Put(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
        } else {
          logger.info("Cancel");
        }
      });
      this.phongBanSrv.Put(this.selectedItem)
    }

    async runDelete(item) {
      logger.info("runDelete()", item)
      await
        this.confirm(result => {
          if (result) this.phongBanSrv.Delete(item.id).then(_ => this.showSuccess()).then(_ => this.runFilter())
          else this.showCancel()
        })
    }

    async runDeleteMany() {
      logger.info("runDeleteList()", this.selectedList)
      this.confirm(result => {
      })
      let deletedIds = this.selectedList.map(x => x.id);
      await this.phongBanSrv.DeleteMany(deletedIds)
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
