
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


@inject(AuthenService, DialogController, ValidationControllerFactory, QuizService, QuestionService, DialogService)

export class AddQuestions {
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
  allQuestions: Question[];

  ListQuizStatus = ObjectStatus.ObjectStatusList();

  async activate(dto: Quiz) {
    this.item = dto;
    await Promise.all([
      this.allQuestions = await this.QuestionSrv.GetAll()
    ]);
    this.updateCheckAllQuestions();
    logger.info('Quiz dto', this.allQuestions);
  }

  updateCheckAllQuestions(){
    for (var i in this.allQuestions) {
      if (this.item.listQuestionIds.includes(this.allQuestions[i].id)) {
        this.allQuestions[i].isCheck = true;
      }else{
        this.allQuestions[i].isCheck = false;
      }
    }
  }

  toggleQuestion(id: number) {
    if (this.item.listQuestionIds.findIndex(i => i == id) > -1) {
      logger.info('xóa id', id, this.item.listQuestionIds.length)
      this.item.listQuestionIds = this.item.listQuestionIds.filter(i => i != id);
      logger.info('after xóa', id, this.item.listQuestionIds.length)
      
    } else {
      this.item.listQuestionIds.push(id);
      logger.info('thêm id', id)
    }
    this.updateCheckAllQuestions();
  }


  enableAction(actionNum: number): boolean {
    return ListAction.checkActionEnable(actionNum, this.item.quizStatus);
  }

  async runAction(actionCode: number) {
    let seft = this;
    logger.info('runAction() ', this.item);

    this.validationcontroller.validate({ object: this.item, rules: newQuizValidationRules }).then((result) => {
      if (result.valid) {
        this.ctrl.ok(this.item);
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
