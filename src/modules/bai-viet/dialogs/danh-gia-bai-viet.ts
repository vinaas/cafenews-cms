import { BaiViet, newBaiVietValidationRules } from './../models/bai-viet';
import { logger } from './../logger';
import { BootstrapFormRenderer } from './../../../helpers/bootstrap-form-renderer';
import { inject } from 'aurelia-framework';
import { DialogController } from "aurelia-dialog";
import { ValidationControllerFactory, ValidationController } from "aurelia-validation";
import { ChuyenMucService, ChuyenMucBaiVietServiceImpl } from '../../chuyen-muc-bai-viet/services/chuyen-muc-service';
@inject(DialogController, ValidationControllerFactory, ChuyenMucBaiVietServiceImpl)

export class DanhGiaBaiViet {
  validationcontroller: ValidationController;
  constructor(private ctrl: DialogController, private controllerFactory,  private chuyenMucSer:ChuyenMucService) {
    this.validationcontroller = controllerFactory.createForCurrentScope();
    this.validationcontroller.addRenderer(new BootstrapFormRenderer());
  }
  get getTieuDe() {
    if (this.item.id) return "Cập nhật";
    return "Thêm mới";
  }

  item: BaiViet;
  itemBaiViet: BaiViet[];
  ckEditorValue = 'I am from viewmodel';

  async activate(dto: BaiViet) {
    this.item = dto;
    let sefl = this;
    await Promise.all([
      this.chuyenMucSer.GetAll().then(rec=>sefl.itemBaiViet = rec)
    ]);
    logger.info('BaiViet dto', dto);
  }
  xepLoai(vitri: number) {
    this.item.reviewPoint = vitri;
  }
  save() {
    logger.info('item', this.item)
    this.validationcontroller.validate({ object: this.item, rules: newBaiVietValidationRules }).then((result) => {
      logger.info('result.valid', result.valid)
      if (result.valid) {
        this.ctrl.ok(this.item);
      }
    })
  }

}
