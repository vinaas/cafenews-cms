
import { PLATFORM } from 'aurelia-pal';
import { QuizStatus, ListAction } from '../../../resources/base/status';

import { BootstrapFormRenderer } from './../../../helpers/bootstrap-form-renderer';
import { inject } from 'aurelia-framework';
import { DialogController, DialogService } from "aurelia-dialog";
import { ValidationControllerFactory, ValidationController } from "aurelia-validation";

import { AppSetting } from '../../../appsettings/index'
import { Helper } from './../../../resources/base/helper';


import { AuthenService } from '../../../authen/authenService';
import { Filter } from '../../../resources/base/filter-base';
import { logger } from '../logger';
import { QuizService } from '../services/quiz-service';
import { Quiz, newQuizValidationRules } from '../models/quiz';


@inject(AuthenService, DialogController, ValidationControllerFactory, QuizService, DialogService)

export class UpdateQuiz {
  validationcontroller: ValidationController;
  constructor(private authenSrv: AuthenService, private ctrl: DialogController, private controllerFactory, private QuizSrv: QuizService,
    private dialogService: DialogService) {
    this.validationcontroller = controllerFactory.createForCurrentScope();
    this.validationcontroller.addRenderer(new BootstrapFormRenderer());
  }

  get getTieuDe() {
    if (this.item.id) return "Cập nhật";
    return "Thêm mới";
  }

  item: Quiz;
  itemQuiz: Quiz[];
  daDangFilter: Filter = {
    order: "date DESC", where: {
      "trangThai": QuizStatus.PUBLISHED_014
    }
  };
  dsQuizDaDang: Quiz[];

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

  async activate(dto: Quiz) {
    this.item = dto;
    let sefl = this;
    await Promise.all([
    ]);

    this.QuizSrv.GetAll(this.daDangFilter).then(rec => this.dsQuizDaDang = rec);

    logger.info('Quiz dto', dto);
    
    
  }

  enableAction(actionNum: number): boolean {
    return ListAction.checkActionEnable(actionNum, this.item.quizStatus);
  }

  async runAction(actionCode: number) {
    let seft = this;
    logger.info('runAction() ', this.item);

    this.validationcontroller.validate({ object: this.item, rules: newQuizValidationRules }).then((result) => {
      if (result.valid) {
        console.log(result);
        this.QuizSrv.DoAction(actionCode, this.item).then(_ => {
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
