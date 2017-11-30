import { PLATFORM } from 'aurelia-pal';
import { ChuDeBaiViet } from './models/chu-de-bai-viet';
import { ChuDeBaiVietServiceImpl, ChuDeService } from './services/chu-de-service';
import { Filter } from './../../resources/base/filter-base';
import { ViewModelBase } from './../../resources/base/viewmodel-base';
import { inject } from 'aurelia-framework';
import { logger } from "./logger";
import { DialogService } from "aurelia-dialog";
import { InsertOrUpdateChuDe } from './dialogs/update-chu-de-dialog';
@inject(ChuDeBaiVietServiceImpl, DialogService)
export class ChuDe implements ViewModelBase {

  items: ChuDeBaiViet[];
  itemsCount: number
  selectedItem: ChuDeBaiViet;
  selectedList: ChuDeBaiViet[];
  filter: Filter = { skip: 0, limit: 10, where: {} };
  asyncTask // task control waiting view
  itemsThe:ChuDeBaiViet[];
  startDate:Date;
  endDate:Date;

  constructor(private chuDeSrv: ChuDeService, private dialogService: DialogService) {
  }

  async activate(params, routeConfig, navigationInstruction) {
    await this.runFilter()

  }
  async paginationChanged(event) {
    await this.runFilter()
  }

  async runFilter() {
    if(typeof this.filter.where["theId"]!=undefined && this.filter.where["theId"]==-1)
      delete this.filter.where["theId"];

    if(this.startDate !=undefined && this.endDate!=undefined)
      this.filter.where = Object.assign({},this.filter.where,{ and: [{ "date": { "lte": new Date(this.endDate) } }, { "date": { "gte": new Date(this.startDate) } }] });
    else 
      {
          delete this.filter.where["and"];
          if(this.startDate != undefined)
              this.filter.where = Object.assign({},this.filter.where,{ "date": { "gte": new Date(this.startDate) } });
          if(this.endDate != undefined)
              this.filter.where = Object.assign({},this.filter.where,{ "date": { "lte": new Date(this.endDate) } });
      }

    logger.info('runFilter', this.filter)
    await (this.asyncTask = Promise.all([
      this.chuDeSrv.GetAll(this.filter).then(rec => this.items = rec),
      this.chuDeSrv.GetCount(this.filter).then(rec => this.itemsCount = rec),
      this.chuDeSrv.GetAll().then(rec=>this.itemsThe = rec )
      // this.timerDo(1000) 
    ]))
  }

  timerDo(ms = 0) {
      return new Promise((resolve, reject) => { setTimeout(() => { resolve(true) }, ms) });
  }

  runCreate() {
    //torun gan select tu dialog tra ve
    this.selectedItem = new ChuDeBaiViet()
    this.dialogService.open({ viewModel: InsertOrUpdateChuDe, model: this.selectedItem }).whenClosed((result) => {
      if (!result.wasCancelled) {
        this.selectedItem = result.output;
        this.chuDeSrv.Post(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
      } else {
        logger.info("Cancel");
      }
    });

    logger.info("runCreate()", this.selectedItem)
    //this.chuDeSrv.Post(this.selectedItem)
  }

  runUpdate(item) {
    //torun gan select tu dialog tra ve
    this.selectedItem = item
    logger.info("runRequest()", this.selectedItem)
    this.dialogService.open({ viewModel: InsertOrUpdateChuDe, model: this.selectedItem }).whenClosed((result) => {
      if (!result.wasCancelled) {
        this.selectedItem = result.output;
        this.chuDeSrv.Put(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
      } else {
        logger.info("Cancel");
      }
    });
    this.chuDeSrv.Put(this.selectedItem)
  }

  async runDelete(item) {
    logger.info("runDelete()", item)
    await
      this.confirm(result => {
        if (result) this.chuDeSrv.Delete(item.id).then(_ => this.showSuccess()).then(_ => this.runFilter())
        else this.showCancel()

      })
  }

  async runDeleteMany() {
    logger.info("runDeleteList()", this.selectedList)
    this.confirm(result => {

    })
    let deletedIds = this.selectedList.map(x => x.id);
    await this.chuDeSrv.DeleteMany(deletedIds)
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
