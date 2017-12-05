import { inject } from "aurelia-dependency-injection";
import { DialogService } from "aurelia-dialog";
import { Filter } from "../../resources/base/filter-base";
import { logger } from "./logger";
import { PLATFORM } from "aurelia-pal";
import { QuestionService } from "../questions/services/questionService";
import { Question } from "../questions/models/question";
import { UpdateQuestion } from "../questions/dialogs/updateQuestion";

@inject(QuestionService,  DialogService)
export class DanhSachQuestion {

  items: Question[];
  itemsCount: number
  selectedItem: Question;
  selectedList: Question[];
  filter: Filter = { skip: 0, limit: 10, order: "date DESC", where: { 
   
  } };
  asyncTask // task control waiting view
  startDate:Date;
  endDate:Date;

  constructor(private QuestionSrv: QuestionService, private dialogService: DialogService) {
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
      this.QuestionSrv.GetAll(this.filter).then(rec => this.items = rec),
      this.QuestionSrv.GetCount(this.filter).then(rec => this.itemsCount = rec),

    ]))
    logger.info("Questions" + this.items);
  }

  enableAction(status:string = '') : boolean {
    return true; 
  }

  runUpdate(item : Question) {
    this.selectedItem = item
    logger.info("runUpdate()")
    this.dialogService.open({ viewModel: UpdateQuestion, model: this.selectedItem }).whenClosed((result) => {
      if (!result.wasCancelled) {
        this.selectedItem = result.output;
        logger.info("item ", this.selectedItem) 
        this.QuestionSrv.Patch(this.selectedItem).then(_ => this.showSuccess()).then(_ => this.runFilter()).catch(err => this.showError(err))
      } else {
        logger.info("Cancel");
      }
    });
  }
  async runDelete(item) {
    logger.info("runDelete()", item)
    await
      this.confirm(result => {
        if (result) this.QuestionSrv.Delete(item.id).then(_ => this.showSuccess()).then(_ => this.runFilter())
        else this.showCancel()

      })
  }

  async runDeleteMany() {
    logger.info("runDeleteList()", this.selectedList)
    this.confirm(result => {

    })
    let deletedIds = this.selectedList.map(x => x.id);
    await this.QuestionSrv.DeleteMany(deletedIds)
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
