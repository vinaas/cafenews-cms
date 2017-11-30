import { User, userValidationRules } from './../models/user';
import { logger } from './../logger';
import { BootstrapFormRenderer } from './../../../helpers/bootstrap-form-renderer';
import { inject } from 'aurelia-framework';
import { DialogController } from "aurelia-dialog";
import { ValidationControllerFactory, ValidationController } from "aurelia-validation";
@inject(DialogController, ValidationControllerFactory)

export class ChiTietUser {
  validationcontroller: ValidationController;
  constructor(private ctrl: DialogController, private controllerFactory) {
    this.validationcontroller = controllerFactory.createForCurrentScope();
    this.validationcontroller.addRenderer(new BootstrapFormRenderer());
  }
  get getTieuDe() {
    if (this.item.id) return "Cập nhật";
    return "Thêm mới";
  }

  item: User;
  activate(dto: User) {
    this.item = dto
    logger.info('User dto', dto);
    // this.phongBanDto = dto;
  }
  
  save() {
    logger.info('item', this.item)
    this.validationcontroller.validate({ object: this.item, rules: userValidationRules }).then((result) => {
      logger.info('result.valid', result.valid)
      if (result.valid) {
        this.ctrl.ok(this.item);
      }
    })

  }

}
