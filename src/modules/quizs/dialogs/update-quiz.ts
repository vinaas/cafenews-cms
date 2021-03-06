
import { PLATFORM } from 'aurelia-pal';
import { QuizStatus, ListAction, ObjectStatus } from '../../../resources/base/status';

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
import { Question } from '../../questions/models/question';
import { QuestionService } from '../../questions/services/questionService';
import { AddQuestions } from './add-questions';


@inject(AuthenService, DialogController, ValidationControllerFactory, QuizService, QuestionService, DialogService)

export class UpdateQuiz {
  validationcontroller: ValidationController;
  constructor(private authenSrv: AuthenService, private ctrl: DialogController, private controllerFactory, 
    private QuizSrv: QuizService,
    private QuestionSrv: QuestionService, 
    private dialogService: DialogService) {
    this.validationcontroller = controllerFactory.createForCurrentScope();
    this.validationcontroller.addRenderer(new BootstrapFormRenderer());
  }

  get getTieuDe() {
    // if (this.item.id) return "Cập nhật";
    return "Thêm mới";
  }

  item: Quiz;
  itemQuiz: Quiz[];
  listQuestion : Question[]; 
  allQuestion : Question[];
  ListQuizStatus = ObjectStatus.ObjectStatusList();

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
    await Promise.all([
      this.allQuestion = await this.QuestionSrv.GetAll()
    ]);
    this.getListQuestion();  
    logger.info('Quiz dto', this.listQuestion);
  }
  
  getListQuestion() {
    this.listQuestion = this.allQuestion.filter(a => 
      this.item.listQuestionIds.includes(a.id)
    );
  }

  enableAction(actionNum: number): boolean {
    return ListAction.checkActionEnable(actionNum, this.item.status);
  }

  async runAction(actionCode: number) {
    logger.info('runAction() ', actionCode);
    logger.info('runAction() ', this.item);
    this.validationcontroller.validate({ object: this.item, rules: newQuizValidationRules }).then((result) => {
      console.log(result);
      if (result.valid) {
        this.QuizSrv.DoAction(actionCode, this.item).then(_ => {
          console.log(result);
          this.showSuccess()
          this.ctrl.ok(this.item);
        }).catch();
        logger.info('item', this.item)
      }
    })
  }
  
  runAddQuestion() {
    logger.info("runAddQuestion()")
    this.dialogService.open({ viewModel: AddQuestions, model: this.item }).whenClosed((result) => {
      if (!result.wasCancelled) {
        this.item = result.output;
        this.getListQuestion();
      } else {
        logger.info("Cancel");
      }
    });
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
