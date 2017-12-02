
import { PLATFORM } from 'aurelia-pal';


import { BootstrapFormRenderer } from './../../../helpers/bootstrap-form-renderer';
import { inject } from 'aurelia-framework';
import { DialogController, DialogService } from "aurelia-dialog";
import { ValidationControllerFactory, ValidationController } from "aurelia-validation";

import { AppSetting } from '../../../appsettings/index'
import { Helper } from './../../../resources/base/helper';


import { AuthenService } from '../../../authen/authenService';
import { Filter } from '../../../resources/base/filter-base';
import { logger } from '../logger';
import { QuestionService } from '../services/questionService';
import { Question, newQuestionValidationRules } from '../models/questionModel';
import { QuestionStatus, QuestionActions } from '../../../resources/base/questionStatus';




@inject(AuthenService, DialogController, ValidationControllerFactory, QuestionService, DialogService)

export class UpdateQuestion {
  validationcontroller: ValidationController;
  constructor(private authenSrv: AuthenService, private ctrl: DialogController, private controllerFactory, private QuestionSrv: QuestionService,
    private dialogService: DialogService) {
    this.validationcontroller = controllerFactory.createForCurrentScope();
    this.validationcontroller.addRenderer(new BootstrapFormRenderer());
  }

  get getTieuDe() {
    if (this.item.id) return "Cập nhật";
    return "Thêm mới";
  }

  item: Question;
  itemQuestion: Question[];
  daDangFilter: Filter = {
    order: "date DESC", where: {
      "trangThai": QuestionStatus.PUBLISHED_014
    }
  };
  dsQuestionDaDang: Question[];

  titleWordCount: number;
  chapWordCount: number;

  uploadLink: string = AppSetting.UploadPath + '/upload';

  ckconfig = {
    extraPlugins: 'uploadimage,customupload',
    height: '500px',
    uploadUrl: this.uploadLink,
    downloadUrl: AppSetting.DownloadPath
  }
  ckEditorValue = 'I am from viewmodel';

  async activate(dto: Question) {
    this.item = dto;
    let sefl = this;
    await Promise.all([
    ]);

    this.QuestionSrv.GetAll(this.daDangFilter).then(rec => this.dsQuestionDaDang = rec);

    logger.info('Question dto', dto);
    
    
  }

  enableAction(actionNum: number): boolean {
    return QuestionActions.checkActionEnable(actionNum, this.item.status);
  }

  async runAction(actionCode: number) {
    let seft = this;
    logger.info('runAction() ', this.item);

    this.validationcontroller.validate({ object: this.item, rules: newQuestionValidationRules }).then((result) => {
      if (result.valid) {
        console.log(result);
        this.QuestionSrv.DoAction(actionCode, this.item).then(_ => {
          this.showSuccess()
          this.ctrl.ok(this.item);
        }).catch();
        logger.info('item', this.item)
      }
    })

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
