import { logger } from "./logger";
import { PLATFORM } from 'aurelia-pal';
import { inject } from 'aurelia-framework';
import { DialogService } from "aurelia-dialog";

import { Filter } from './../../resources/base/filter-base';
import { ViewModelBase } from './../../resources/base/viewmodel-base';
import { UserServiceImpl, UserService } from './services/user-service';

import { User } from './models/user';
import { ChiTietUser } from './dialogs/update-user-dialog';

@inject(UserServiceImpl, DialogService)
export class DanhSachUser implements ViewModelBase {
    items: User[];
    itemsCount: number
    selectedItem: User;
    selectedList: User[];
    filter: Filter = { skip: 0, limit: 10, where: {} };
    asyncTask // task control waiting view

    constructor(
        private userSrv: UserService, 
        private dialogService: DialogService) {}

    async activate(params, routeConfig, navigationInstruction) {
        await this.runFilter()

    }

    async paginationChanged(event) {
        await this.runFilter()
    }

    async runFilter() {
        logger.info('runFilter', this.filter)
        await (this.asyncTask = Promise.all([
            this.userSrv.GetAll(this.filter).then(rec => this.items = rec),
            this.userSrv.GetCount(this.filter).then(rec => this.itemsCount = rec),
            // this.timerDo(1000) 

        ]))

    }

    timerDo(ms = 0) {
        return new Promise((resolve, reject) => { setTimeout(() => { resolve(true) }, ms) });
    }
 
    async runCreate() {
        //torun gan select tu dialog tra ve
        this.selectedItem = new User()
        this.dialogService.open({ viewModel: ChiTietUser, model: this.selectedItem }).whenClosed((result) => {
            if (!result.wasCancelled) {
                this.selectedItem = result.output;
                this.userSrv.Post(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
                logger.info('output', result.output);
            } else {
                logger.info("Cancel");
            }
        });

        logger.info("runCreate()", this.selectedItem)
        //this.userSrv.Post(this.selectedItem)
    }

    async runUpdate(item) {
        //torun gan select tu dialog tra ve
        this.selectedItem = item
        logger.info("runUpdate()", this.selectedItem)
        this.dialogService.open({ viewModel: ChiTietUser, model: this.selectedItem }).whenClosed((result) => {
            if (!result.wasCancelled) {
                this.selectedItem = result.output;
                this.userSrv.Patch(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
            } else {
                logger.info("Cancel");
            }
        });
    }

    async runView(item) {
        //torun gan select tu dialog tra ve
        this.selectedItem = item
        logger.info("runUpdate()", this.selectedItem)
        this.dialogService.open({ viewModel: ChiTietUser, model: this.selectedItem }).whenClosed((result) => {
            if (!result.wasCancelled) {
                this.selectedItem = result.output;
                this.userSrv.Patch(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
            } else {
                logger.info("Cancel");
            }
        });
        this.userSrv.Patch(this.selectedItem)
    }

    async runDelete(item) {
        logger.info("runDelete()", item)
        await
            this.confirm(result => {
                if (result) this.userSrv.Delete(item.id).then(_ => this.showSuccess()).then(_ => this.runFilter())
                else this.showCancel()

            })
    }

    async runDeleteMany() {
        logger.info("runDeleteList()", this.selectedList)
        this.confirm(result => {

        })
        let deletedIds = this.selectedList.map(x => x.id);
        await this.userSrv.DeleteMany(deletedIds)
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
