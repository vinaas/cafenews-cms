import { ChuyenMucBaiVietServiceImpl, ChuyenMucService } from '../chuyen-muc-bai-viet/services/chuyen-muc-service';
import { PLATFORM } from 'aurelia-pal';
import { BaiViet } from './models/bai-viet';
import { BaiVietService, IBaiVietService } from './services/bai-viet-service';
import { Filter } from './../../resources/base/filter-base';
import { ViewModelBase } from './../../resources/base/viewmodel-base';
import {BaiVietStatus } from '../../resources/base/status';
import { inject } from 'aurelia-framework';
import { logger } from "./logger";
import { DialogService } from "aurelia-dialog";
import { UpdateBaiViet } from './dialogs/update-bai-viet';
//import { DuyetBaiViet } from './dialogs/duyet-bai-viet';
import { TuChoiBaiViet } from './dialogs/tu-choi-bai-viet';
import { ChuyenMucBaiViet } from '../chuyen-muc-bai-viet/models/chuyen-muc-bai-viet';
import { DangBaiViet } from './dialogs/dang-bai-viet';
import { DanhGiaBaiViet } from './dialogs/danh-gia-bai-viet';
@inject(BaiVietService, ChuyenMucBaiVietServiceImpl, DialogService)
export class DSBaiVietTieuDiem {

  items: BaiViet[];
  itemsCount: number
  selectedItem: BaiViet;
  selectedList: BaiViet[];
  filter: Filter = { };
  asyncTask // task control waiting view
  dsChuyenMuc:ChuyenMucBaiViet[];

  constructor(private baiVietSrv: IBaiVietService, private ChuyenMucSrv: ChuyenMucService, private dialogService: DialogService) {
  }

  async activate(params, routeConfig, navigationInstruction) {
    await this.runFilter()

  }
  async paginationChanged(event) {
    await this.runFilter()
  }

  async runFilter() {
    this.filter.where = Object.assign({},this.filter.where,{ "tieuDiem": { "gt": 0} });
    logger.info('runFilter', this.filter)
    
    await (this.asyncTask = Promise.all([
      this.baiVietSrv.GetAll(this.filter).then(rec => this.items = rec),
      this.ChuyenMucSrv.GetAll().then(rec=>this.dsChuyenMuc = rec ),
    ]))
 //   logger.info('GetCount', this.itemsCount)
  }

  timerDo(ms = 0) {
      return new Promise((resolve, reject) => { setTimeout(() => { resolve(true) }, ms) });
  }

  runUpdate(item) {
    //torun gan select tu dialog tra ve
    this.selectedItem = item
    logger.info("runRequest()", this.selectedItem)
    this.dialogService.open({ viewModel: UpdateBaiViet, model: this.selectedItem }).whenClosed((result) => {
      if (!result.wasCancelled) {
        this.selectedItem = result.output;
        logger.info("OK update()",this.selectedItem);
        this.runFilter()
     //   this.baiVietSrv.Patch(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
      } else {
        logger.info("Cancel");
      }
    });
    //this.baiVietSrv.Put(this.selectedItem)
  }
  runDanhGia(item) {
    // return ;
    // torun gan select tu dialog tra ve
     let seft = this;
     this.selectedItem = item
     logger.info('item', this.selectedItem)
     this.dialogService.open({ viewModel: DanhGiaBaiViet, model: this.selectedItem }).whenClosed((result) => {
       if (!result.wasCancelled) {
         this.selectedItem = result.output;
         this.selectedItem.trangThai = BaiVietStatus.PUBLISHED_014 
         this.baiVietSrv.Patch(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
       } else {
         logger.info("Cancel");
       }
     });
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
      title: "Bạn Có Chắc Chắn?",
      text: "Khi Xóa nội dung này!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Đồng ý!",
      cancelButtonText: "Không, ngưng xóa!",
      closeOnConfirm: false,
      closeOnCancel: false
    },
      function (isConfirm) {
        cb(isConfirm)
      })
  }

}
