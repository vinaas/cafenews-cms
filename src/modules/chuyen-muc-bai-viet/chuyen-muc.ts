import { PLATFORM } from 'aurelia-pal';
import { ChuyenMucBaiViet } from './models/chuyen-muc-bai-viet';
import { ChuyenMucBaiVietServiceImpl, ChuyenMucService } from './services/chuyen-muc-service';
import { Filter } from './../../resources/base/filter-base';
import { ViewModelBase } from './../../resources/base/viewmodel-base';
import { inject } from 'aurelia-framework';
import { logger } from "./logger";
import { DialogService } from "aurelia-dialog";
import { InsertOrUpdateChuyenMuc } from './dialogs/update-chuyen-muc-dialog';
@inject(ChuyenMucBaiVietServiceImpl, DialogService)
export class ChuyenMuc implements ViewModelBase {

  items: ChuyenMucBaiViet[];
  itemsCount: number
  selectedItem: ChuyenMucBaiViet;
  selectedList: ChuyenMucBaiViet[];
  filter: Filter = { skip: 0, limit: 10, where: {} };
  asyncTask // task control waiting view
  itemsChuyenMuc:ChuyenMucBaiViet[];
  startDate:Date;
  endDate:Date;

  constructor(private chuyenMucSrv: ChuyenMucService, private dialogService: DialogService) {
  }

  async activate(params, routeConfig, navigationInstruction) {
    await this.runFilter()

  }
  async paginationChanged(event) {
    await this.runFilter()
  }

  async runFilter() {
    if(typeof this.filter.where["chuyenMucId"]!=undefined && this.filter.where["chuyenMucId"]==-1)
      delete this.filter.where["chuyenMucId"];

    if(this.startDate !=undefined && this.endDate!=undefined)
      this.filter.where = Object.assign({},this.filter.where,{ and: [{ "ngayTao": { "lte": new Date(this.endDate) } }, { "ngayTao": { "gte": new Date(this.startDate) } }] });
    else 
      {
          delete this.filter.where["and"];
          if(this.startDate != undefined)
              this.filter.where = Object.assign({},this.filter.where,{ "ngayTao": { "gte": new Date(this.startDate) } });
          if(this.endDate != undefined)
              this.filter.where = Object.assign({},this.filter.where,{ "ngayTao": { "lte": new Date(this.endDate) } });
      }

    logger.info('runFilter', this.filter)
    await (this.asyncTask = Promise.all([
      this.chuyenMucSrv.GetAll(this.filter).then(rec => this.items = rec),
      this.chuyenMucSrv.GetCount(this.filter).then(rec => this.itemsCount = rec),
     // this.chuyenMucSrv.GetAll().then(rec=>this.itemsChuyenMuc = rec )
      // this.timerDo(1000) 
    ]))
  }

  timerDo(ms = 0) {
      return new Promise((resolve, reject) => { setTimeout(() => { resolve(true) }, ms) });
  }

  runCreate() {
    //torun gan select tu dialog tra ve
    this.selectedItem = new ChuyenMucBaiViet()
    this.dialogService.open({ viewModel: InsertOrUpdateChuyenMuc, model: this.selectedItem }).whenClosed((result) => {
      if (!result.wasCancelled) {
        this.selectedItem = result.output;
        this.chuyenMucSrv.Post(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
      } else {
        logger.info("Cancel");
      }
    });

    logger.info("runCreate()", this.selectedItem)
    //this.chuyenMucSrv.Post(this.selectedItem)
  }

  runUpdate(item) {
    //torun gan select tu dialog tra ve
    this.selectedItem = item
    logger.info("runUpdate()", this.selectedItem)
    this.dialogService.open({ viewModel: InsertOrUpdateChuyenMuc, model: this.selectedItem }).whenClosed((result) => {
      if (!result.wasCancelled) {
        this.selectedItem = result.output;
        this.chuyenMucSrv.Put(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
      } else {
        logger.info("Cancel");
      }
    });
    this.chuyenMucSrv.Put(this.selectedItem)
  }

  async runDelete(item) {
    logger.info("runDelete()", item)
    await
      this.confirm(result => {
        if (result) this.chuyenMucSrv.Delete(item.id).then(_ => this.showSuccess()).then(_ => this.runFilter())
        else this.showCancel()

      })
  }

  async runDeleteMany() {
    logger.info("runDeleteList()", this.selectedList)
    this.confirm(result => {

    })
    let deletedIds = this.selectedList.map(x => x.id);
    await this.chuyenMucSrv.DeleteMany(deletedIds)
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
