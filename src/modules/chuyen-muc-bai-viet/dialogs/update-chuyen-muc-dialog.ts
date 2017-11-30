import { ChuyenMucBaiViet, newChuyenMucValidationRules } from './../models/chuyen-muc-bai-viet';
import { logger } from './../logger';
import { BootstrapFormRenderer } from './../../../helpers/bootstrap-form-renderer';
import { inject } from 'aurelia-framework';
import { DialogController } from "aurelia-dialog";
import { ValidationControllerFactory, ValidationController } from "aurelia-validation";
import { ChuyenMucService, ChuyenMucBaiVietServiceImpl} from '../services/chuyen-muc-service';
import { Helper } from '../../../resources/base/helper';
import { computedFrom } from 'aurelia-binding';
@inject(DialogController, ValidationControllerFactory, ChuyenMucBaiVietServiceImpl)

export class InsertOrUpdateChuyenMuc {
  validationcontroller: ValidationController;
  constructor(private ctrl: DialogController, private controllerFactory, private chuyenMucSrv: ChuyenMucService) {
    this.validationcontroller = controllerFactory.createForCurrentScope();
    this.validationcontroller.addRenderer(new BootstrapFormRenderer());
  }
  get getTieuDe() {
    if (this.item.id) return "Cập nhật";
    return "Thêm mới";
  }

  
  item: ChuyenMucBaiViet;
  dsChuyenMuc: ChuyenMucBaiViet[];
  async activate(dto: ChuyenMucBaiViet) {
    this.item = dto
    logger.info('ChuyenMucBaiViet dto', dto);
    await Promise.all([
      this.chuyenMucSrv.GetAll().then(rec => this.dsChuyenMuc = rec),
    ])
  }
  
  generateSlug() {
    console.log('ten', this.item.displayName)
    this.item.chuyenMuc = Helper.generateSlug(this.item.displayName);
  }

  save() {
    this.item.slug = this.item.chuyenMuc;
    this.item.maChuyenMuc = this.item.chuyenMuc;
    logger.info('item', this.item);

    this.validationcontroller.validate({ object: this.item, rules: newChuyenMucValidationRules }).then((result) => {
      logger.info('result.valid', result.valid)
      if (result.valid) {
        this.ctrl.ok(this.item);
      }
    })
  }

}
