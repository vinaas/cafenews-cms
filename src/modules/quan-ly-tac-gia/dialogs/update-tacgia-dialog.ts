import { TacGia} from './../models/tac-gia';
import { logger } from './../logger';
import { BootstrapFormRenderer } from './../../../helpers/bootstrap-form-renderer';
import { inject } from 'aurelia-framework';
import { DialogController } from "aurelia-dialog";
import { ValidationControllerFactory, ValidationController } from "aurelia-validation";
@inject(DialogController, ValidationControllerFactory)

export class InsertOrUpdateTacGia {
  validationcontroller: ValidationController;
  constructor(private ctrl: DialogController, private controllerFactory) {
    this.validationcontroller = controllerFactory.createForCurrentScope();
    this.validationcontroller.addRenderer(new BootstrapFormRenderer());
  }
  get getTieuDe() {
    if (this.item.id) return "Cập nhật";
    return "Thêm mới";
  }
  item: TacGia;
  activate(dto: TacGia) {
    this.item = dto
    logger.info('TacGia dto', dto);
  }
  save() {
    logger.info('item', this.item)
    this.validationcontroller.validate({ object: this.item}).then((result) => {
      // this.item.password == "123456";
      logger.info('result.valid', result.valid)
      if (result.valid) {
        this.ctrl.ok(this.item);
      }
    })

  }
}
