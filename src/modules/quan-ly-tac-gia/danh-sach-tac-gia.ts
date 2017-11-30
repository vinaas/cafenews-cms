import { PLATFORM } from 'aurelia-pal';
import { InsertOrUpdateTacGia } from './dialogs/update-tacgia-dialog';
import { TacGia } from './models/tac-gia';
import { TacGiaServiceImpl, TacGiaService } from './services/tac-gia-service';
import { Filter } from './../../resources/base/filter-base';
import { ViewModelBase } from './../../resources/base/viewmodel-base';
import { inject } from 'aurelia-framework';
import { logger } from "./logger";
import { DialogService } from "aurelia-dialog";
import { InsertOrViewTacGia } from './dialogs/view-tacgia-dialog';
import { InsertOrViewBaiTacGia } from './dialogs/view-bai-tacgia-dialog';
@inject(TacGiaServiceImpl, DialogService)
export class DanhSachKhachHang implements ViewModelBase {
    items: TacGia[];
    itemsCount: number
    selectedItem: TacGia;
    selectedList: TacGia[];
    filter: Filter = { skip: 0, limit: 10, where: {} };
    asyncTask // task control waiting view

    constructor(private tacGiaSrv: TacGiaService, private dialogService: DialogService) {

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
            this.tacGiaSrv.GetAll(this.filter).then(rec => this.items = rec),
            this.tacGiaSrv.GetCount(this.filter).then(rec => this.itemsCount = rec),
            // this.timerDo(1000) 

        ]))

    }
    timerDo(ms = 0) {
        return new Promise((resolve, reject) => { setTimeout(() => { resolve(true) }, ms) });
    }
    async runCreate() {
        //torun gan select tu dialog tra ve
        this.selectedItem = new TacGia()
        this.dialogService.open({ viewModel: InsertOrUpdateTacGia, model: this.selectedItem }).whenClosed((result) => {
            if (!result.wasCancelled) {
              this.selectedItem.password = "123456";
              this.selectedItem = result.output;
              this.tacGiaSrv.Post(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
            } else {
                logger.info("Cancel");
            }
        });

        logger.info("runCreate()", this.selectedItem)
        //this.tacGiaSrv.Post(this.selectedItem)
    }
    async runUpdate(item) {
        //torun gan select tu dialog tra ve
        this.selectedItem = item
        logger.info("runUpdate()", this.selectedItem)
        this.dialogService.open({ viewModel: InsertOrUpdateTacGia, model: this.selectedItem }).whenClosed((result) => {
            if (!result.wasCancelled) {
                this.selectedItem = result.output;
                this.tacGiaSrv.Put(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
            } else {
                logger.info("Cancel");
            }
        });
        this.tacGiaSrv.Put(this.selectedItem)
    }
    async runView(item) {
        //torun gan select tu dialog tra ve
        this.selectedItem = item
        logger.info("runView()", this.selectedItem)
        this.dialogService.open({ viewModel: InsertOrViewTacGia, model: this.selectedItem }).whenClosed((result) => {
            if (!result.wasCancelled) {
                this.selectedItem = result.output;
                this.tacGiaSrv.Put(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
            } else {
                logger.info("Cancel");
            }
        });
        this.tacGiaSrv.Put(this.selectedItem)
    }
    async runViewBai(item) {
        //torun gan select tu dialog tra ve
        this.selectedItem = item
        logger.info("runViewBai()", this.selectedItem)
        this.dialogService.open({ viewModel: InsertOrViewBaiTacGia, model: this.selectedItem }).whenClosed((result) => {
            if (!result.wasCancelled) {
                this.selectedItem = result.output;
                this.tacGiaSrv.Put(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
            } else {
                logger.info("Cancel");
            }
        });
        this.tacGiaSrv.Put(this.selectedItem)
    }
    async runDelete(item) {
        logger.info("runDelete()", item)
        await
            this.confirm(result => {
                if (result) this.tacGiaSrv.Delete(item.id).then(_ => this.showSuccess()).then(_ => this.runFilter())
                else this.showCancel()

            })
    }
    async runDeleteMany() {
        logger.info("runDeleteList()", this.selectedList)
        this.confirm(result => {

        })
        let deletedIds = this.selectedList.map(x => x.id);
        await this.tacGiaSrv.DeleteMany(deletedIds)
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
