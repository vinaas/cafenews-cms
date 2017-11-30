import { PhongBan, phongBanValidationRules } from './../models/phong-ban';
import { logger } from './../logger';
import { BootstrapFormRenderer } from './../../../helpers/bootstrap-form-renderer';
import { inject } from 'aurelia-framework';
import { DialogController } from "aurelia-dialog";
import { ValidationControllerFactory, ValidationController } from "aurelia-validation";
@inject(DialogController, ValidationControllerFactory)

export class InsertOrUpdatePhongBan {
  validationcontroller: ValidationController;
  constructor(private ctrl: DialogController, private controllerFactory) {
    this.validationcontroller = controllerFactory.createForCurrentScope();
    this.validationcontroller.addRenderer(new BootstrapFormRenderer());
  }
  get getTieuDe() {
    if (this.item.id) return "Cập nhật";
    return "Thêm mới";
  }
  item: PhongBan;
  activate(dto: PhongBan) {
    this.item = dto
    logger.info('PhongBan dto', dto);
    // this.phongBanDto = dto;
  }
  save() {
    if (this.item.id) 
      this.item.modified = new Date
    else 
      this.item.created = new Date
    logger.info('item', this.item)
    this.validationcontroller.validate({ object: this.item, rules: phongBanValidationRules }).then((result) => {
      logger.info('result.valid', result.valid)
      if (result.valid) {
        this.ctrl.ok(this.item);
      }
    })

  }

}
