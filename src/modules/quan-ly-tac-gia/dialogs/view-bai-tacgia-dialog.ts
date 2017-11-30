import { DialogService } from 'aurelia-dialog';
import { logger } from './../logger';
import { BootstrapFormRenderer } from './../../../helpers/bootstrap-form-renderer';
import { inject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { ValidationControllerFactory, ValidationController } from "aurelia-validation";
import { TacGia } from '../models/tac-gia';
import { Filter } from '../../../resources/base/filter-base';
import { TacGiaService, TacGiaServiceImpl } from '../services/tac-gia-service';
import { PLATFORM } from 'aurelia-pal';
@inject(DialogController, ValidationControllerFactory, TacGiaServiceImpl, DialogService)

export class InsertOrViewBaiTacGia {
  items: TacGia[];
  itemsCount: number
  selectedItem: TacGia;
  selectedList: TacGia[];
  filter: Filter = { skip: 0, limit: 10, where: {} };
  asyncTask; // task control waiting view
  start:any;
  end:any;

  validationcontroller: ValidationController;
  constructor(private ctrl: DialogController, private controllerFactory, private TacGias: TacGiaService, private dialogService: DialogService) {
    PLATFORM.moduleName('./view-bai-tacgia-dialog')
    this.validationcontroller = controllerFactory.createForCurrentScope();
    this.validationcontroller.addRenderer(new BootstrapFormRenderer());
  }

  item: TacGia;
  async activate(dto: TacGia) {
    this.item = new TacGia()
    // this.TacGias = await this.TacGias.GetAll();
    await this.runFilterdialog()
    logger.info('dto', dto);
    logger.info('ViewCongViec', this.TacGias)
    // this.item = dto;
  }

  async paginationChanged(event) {
    await this.runFilterdialog()
  }

  async runFilterdialog() {
    
    // if(this.start && this.end)
    //   {
    //     this.filter.where = Object.assign({},this.filter.where,{
    //       and:{gt:{ngayDang:this.start},lt:{ngayDang:this.end}}
    //     })
    //   }
    //   logger.info('runFilterdialog', this.filter)
    // await (this.asyncTask = Promise.all([
    //   this.TacGias.GetAll(this.filter).then(rec => this.items = rec),
    //   this.TacGias.GetCount(this.filter).then(rec => this.itemsCount = rec),
    //   // this.timerDo(1000) 
    // ]))
  }

  timerDo(ms = 0) {
    return new Promise((resolve, reject) => { setTimeout(() => { resolve(true) }, ms) });
  }

}
