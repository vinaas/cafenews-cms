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
//import { InsertOrDuyetBaiViet } from './dialogs/duyet-bai-viet';
import { ChuyenMucBaiViet } from '../chuyen-muc-bai-viet/models/chuyen-muc-bai-viet';

@inject(BaiVietService, ChuyenMucBaiVietServiceImpl, DialogService)
export class DanhSachBaiViet {

  items: BaiViet[];
  itemsCount: number
  selectedItem: BaiViet;
  selectedList: BaiViet[];
  filter: Filter = { skip: 0, limit: 10, order: "date DESC", where: { 
    or: [ {"trangThai": BaiVietStatus.DRAFT_01},
       {"trangThai": BaiVietStatus.NEW_02},
       {"trangThai": BaiVietStatus.EDIT_03} ,
       {"trangThai": BaiVietStatus.APPROVEREJECTED_05},
       {"trangThai": BaiVietStatus.MULTIAPPROVED_06}]
  } };
  asyncTask // task control waiting view
  dsChuyenMuc:ChuyenMucBaiViet[];
  startDate:Date;
  endDate:Date;

  constructor(private baiVietSrv: IBaiVietService, private ChuyenMucSrv: ChuyenMucService, private dialogService: DialogService) {
  }

  async activate(params, routeConfig, navigationInstruction) {
    await this.runFilter()

  }
  async paginationChanged(event) {
    await this.runFilter()
  }

  async runFilter() {
    if(typeof this.filter.where["category"]!=undefined && this.filter.where["category"]==-1)
      delete this.filter.where["category"];

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
      this.baiVietSrv.GetAll(this.filter).then(rec => this.items = rec),
      this.baiVietSrv.GetCount(this.filter).then(rec => this.itemsCount = rec),
      this.ChuyenMucSrv.GetAll().then(rec=>this.dsChuyenMuc = rec ),
      // this.timerDo(1000) 

    ]))
    logger.info("BaiViets" + this.items);
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

  timerDo(ms = 0) {
      return new Promise((resolve, reject) => { setTimeout(() => { resolve(true) }, ms) });
  }

  runUpdate(item) {
    //torun gan select tu dialog tra ve
    this.selectedItem = item
    logger.info("runUpdate()")
    this.dialogService.open({ viewModel: UpdateBaiViet, model: this.selectedItem }).whenClosed((result) => {
      if (!result.wasCancelled) {
        this.selectedItem = result.output;
        logger.info("item ", this.selectedItem) 
        this.baiVietSrv.Patch(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
      } else {
        logger.info("Cancel");
      }
    });
  }

  RequestApprove(item) {
    //torun gan select tu dialog tra ve
    let seft = this;
    this.selectedItem = item
    logger.info('item', this.selectedItem)
    this.baiVietSrv.RequestApprove_4(this.selectedItem).then(e => this.showSuccess())
     .then(_ => this.runFilter()).catch(err => this.showError(err))
    
    logger.info('OK RequestApprove');
  }

  async runDelete(item) {
    logger.info("runDelete()", item)
    await
      this.confirm(result => {
        if (result) this.baiVietSrv.Delete(item.id).then(_ => this.showSuccess()).then(_ => this.runFilter())
        else this.showCancel()

      })
  }

  async runDeleteMany() {
    logger.info("runDeleteList()", this.selectedList)
    this.confirm(result => {

    })
    let deletedIds = this.selectedList.map(x => x.id);
    await this.baiVietSrv.DeleteMany(deletedIds)
  }

  // private enabledEditButton(trangThai : string) {
  //   if (trangThai == BaiVietStatus.NEW || trangThai == BaiVietStatus.EDIT)
  //     return true;

  //   return false;
  // }

  private enabledSendApproveButton(trangThai : string) {
    if (trangThai == undefined || trangThai == BaiVietStatus.DRAFT_01 ||
      trangThai == BaiVietStatus.NEW_02 || trangThai == BaiVietStatus.EDIT_03 
      || trangThai == BaiVietStatus.APPROVEREJECTED_05)
      return true;

    return false;
  }

  private sendApproveButtonText(trangThai : string) : string
  {
    var text = "Gửi Duyệt";
    if (trangThai == BaiVietStatus.DRAFT_01) 
    text = "Điều Chỉnh";
    if (trangThai == BaiVietStatus.APPROVEREJECTED_05)
      text = "Gửi Duyệt Lại";
    return text;
  }

  // private enabledResendApproveButton(trangThai : string) {
  //   if (trangThai == BaiVietStatus.APPROVEREJECTED)
  //     return true;

  //   return false;
  // }

  private enabledDeleteButton(trangThai : string) {
    return this.enabledSendApproveButton(trangThai);
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
