import { PLATFORM } from 'aurelia-pal';
import { DialogService } from "aurelia-dialog";
import { inject } from 'aurelia-framework';

import { logger } from "./logger";
import { Filter } from './../../resources/base/filter-base';
import { ViewModelBase } from './../../resources/base/viewmodel-base';

import { QuangCao } from './models/quang-cao';
import { ChiTietQuangCao } from './dialogs/update-quangcao-dialog';
import { QuangCaoServiceImpl, QuangCaoService } from './services/quang-cao-service';

@inject(QuangCaoServiceImpl, DialogService)
export class DanhSachQuangCao implements ViewModelBase {
    items: QuangCao[];
    itemsCount: number;
    selectedItem: QuangCao;
    selectedList: QuangCao[];
    filter: Filter = { skip: 0, limit: 10, where: {} };
    asyncTask;

    constructor(private quangCaoSrv: QuangCaoService,
        private dialogService: DialogService) { }

    async activate(params, routeConfig, navigationInstruction) {
        await this.runFilter()
    }

    async paginationChanged(event) {
        await this.runFilter()
    }

    async runFilter() {
        logger.info('runFilter', this.filter)
        await (this.asyncTask = Promise.all([
            this.quangCaoSrv.GetAll(this.filter).then(rec => this.items = rec),
            this.quangCaoSrv.GetCount(this.filter).then(rec => this.itemsCount = rec),
            // this.timerDo(1000) 

        ]))

    }

    timerDo(ms = 0) {
        return new Promise((resolve, reject) => { setTimeout(() => { resolve(true) }, ms) });
    }

    async runCreate() {
        //torun gan select tu dialog tra ve
        this.selectedItem = new QuangCao()
        this.dialogService.open({ viewModel: ChiTietQuangCao, model: this.selectedItem }).whenClosed((result) => {
            if (!result.wasCancelled) {
                //   this.selectedItem.password = "123456";
                this.selectedItem = result.output;
                this.quangCaoSrv.Post(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
            } else {
                logger.info("Cancel");
            }
        });

        logger.info("runCreate()", this.selectedItem)
        //this.quangCaoSrv.Post(this.selectedItem)
    }

    async runUpdate(item) {
        //torun gan select tu dialog tra ve
        this.selectedItem = item
        logger.info("runUpdate()", this.selectedItem)
        this.dialogService.open({ viewModel: ChiTietQuangCao, model: this.selectedItem }).whenClosed((result) => {
            if (!result.wasCancelled) {
                this.selectedItem = result.output;
                this.quangCaoSrv.Put(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
            } else {
                logger.info("Cancel");
            }
        });
        this.quangCaoSrv.Put(this.selectedItem)
    }

    async runView(item) {
        //torun gan select tu dialog tra ve
        this.selectedItem = item
        logger.info("runView()", this.selectedItem)
        this.dialogService.open({ viewModel: ChiTietQuangCao, model: this.selectedItem }).whenClosed((result) => {
            if (!result.wasCancelled) {
                this.selectedItem = result.output;
                this.quangCaoSrv.Put(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
            } else {
                logger.info("Cancel");
            }
        });
        this.quangCaoSrv.Put(this.selectedItem)
    }

    async runViewBai(item) {
        //torun gan select tu dialog tra ve
        this.selectedItem = item
        logger.info("runViewBai()", this.selectedItem)
        this.dialogService.open({ viewModel: ChiTietQuangCao, model: this.selectedItem }).whenClosed((result) => {
            if (!result.wasCancelled) {
                this.selectedItem = result.output;
                this.quangCaoSrv.Put(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
            } else {
                logger.info("Cancel");
            }
        });
        this.quangCaoSrv.Put(this.selectedItem)
    }

    async runDelete(item) {
        logger.info("runDelete()", item)
        await
            this.confirm(result => {
                if (result) this.quangCaoSrv.Delete(item.id).then(_ => this.showSuccess()).then(_ => this.runFilter())
                else this.showCancel()

            })
    }

    async runDeleteMany() {
        logger.info("runDeleteList()", this.selectedList)
        this.confirm(result => {

        })
        let deletedIds = this.selectedList.map(x => x.id);
        await this.quangCaoSrv.DeleteMany(deletedIds)
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
            title: "Xác nhận xóa?",
            text: "Việc xóa sẽ không thể khôi phục lại!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Đồng ý xóa!",
            cancelButtonText: "Không xóa!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                cb(isConfirm)
            })
    }
}
