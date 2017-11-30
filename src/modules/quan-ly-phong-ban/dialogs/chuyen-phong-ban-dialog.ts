import { PhongBan} from './../models/phong-ban';
import { logger } from './../logger';
import { BootstrapFormRenderer } from './../../../helpers/bootstrap-form-renderer';
import { inject } from 'aurelia-framework';
import { DialogController } from "aurelia-dialog";
import { ValidationControllerFactory, ValidationController } from "aurelia-validation";
import { PhongBanService, PhongBanServiceImpl} from '../services/phong-ban-service'
@inject(DialogController, ValidationControllerFactory, PhongBanServiceImpl)

export class InsertOrChuyenPhongBan {
  validationcontroller: ValidationController;
  constructor(private ctrl: DialogController, private controllerFactory, private phongBanSer: PhongBanService) {
    this.validationcontroller = controllerFactory.createForCurrentScope();
    this.validationcontroller.addRenderer(new BootstrapFormRenderer());
  }

  item: PhongBan;
  itemPhongBan: PhongBan[];
  
  async activate(dto: PhongBan) {
    this.item = dto
    let sefl = this;
    await Promise.all([
      this.phongBanSer.GetAll().then(rec=>sefl.itemPhongBan = rec)
    ]);
    // logger.info('ChuyenPhongban dto', dto);
  }

  save() {
    logger.info('item', this.item)
    this.validationcontroller.validate({ object: this.item}).then((result) => {
      logger.info('result.valid', result.valid)
      if (result.valid) {
        this.ctrl.ok(this.item);
      }
    })
  }
}
