import { Router, RouterConfiguration } from 'aurelia-router';
import { BaiViet, newBaiVietValidationRules } from './models/bai-viet';
import { logger } from './logger';
import { inject } from 'aurelia-framework';
import { DialogController } from "aurelia-dialog";
import { ValidationControllerFactory, ValidationController } from "aurelia-validation";
import { BaiVietService, IBaiVietService } from './services/bai-viet-service';
import { BootstrapFormRenderer } from '../../helpers/bootstrap-form-renderer';
import { PLATFORM } from 'aurelia-pal';
import { ChuyenMucBaiViet } from '../chuyen-muc-bai-viet/models/chuyen-muc-bai-viet';
import { ChuyenMucService, ChuyenMucBaiVietServiceImpl } from '../chuyen-muc-bai-viet/services/chuyen-muc-service';

import { TacGia } from '../quan-ly-tac-gia/models/tac-gia';
import { TacGiaService, TacGiaServiceImpl } from '../quan-ly-tac-gia/services/tac-gia-service';
import { Helper} from './../../resources/base/helper';
import {BaiVietStatus, ListAction } from '../../resources/base/status';
import {AppSetting} from '../../appsettings/index'
import { AuthenService } from './../../authen/authenService';


@inject(ValidationControllerFactory, BaiVietService, ChuyenMucBaiVietServiceImpl, TacGiaServiceImpl,AuthenService,  Router)

export class CreateBaiViet {
  
  validationcontroller: ValidationController;
  constructor(private controllerFactory, private bvSer: IBaiVietService, 
    private ChuyenMucSrv: ChuyenMucService, 
    private TacGiaSrv: TacGiaService, 
    private authenSrv: AuthenService,
    private router: Router) {
    this.validationcontroller = controllerFactory.createForCurrentScope();
    this.validationcontroller.addRenderer(new BootstrapFormRenderer());
    if (!authenSrv.isAuthenticated)
      router.navigateToRoute('login');
    logger.info('authenSrv.userInfo ', authenSrv.userInfo);
    this.userName = authenSrv.userInfo.userName;
  }
  userName : string; 

  item: BaiViet;
  
  itemBaiViet: BaiViet[];
  
  selectedItem: BaiViet;
  dsChuyenMuc: ChuyenMucBaiViet[];
  dsTacGia : TacGia[];
  titleWordCount: number;
  chapWordCount: number; 
  asyncTask
  ckEditorValue = '';
  uploadLink : string = AppSetting.UploadPath + '/upload';
  ckconfig = {
        extraPlugins: 'uploadimage,customupload',
        height: '500px', 
        uploadUrl: this.uploadLink,
        downloadUrl: AppSetting.DownloadPath
  }
  
  myInterval : any; 
  async activate(dto: BaiViet) {
    this.item = new BaiViet();
    this.item.date = new Date();
    let sefl = this;
    await Promise.all([
      sefl.ChuyenMucSrv.GetAll().then(rec=>sefl.dsChuyenMuc = rec ),
      sefl.TacGiaSrv.GetAll().then( rs => sefl.dsTacGia = rs ) 
    ]);
    this.item.userId = this.userName;
    logger.info('dsChuyenMuc ', this.dsChuyenMuc);
    this.countTitle();
    this.countChapWord();

    let self = this;
    this.myInterval = setInterval(function(){
      logger.info('Trigger AutoSave() !!!')
      // self.bvSer.AutoSave(self.item, true).then(rec=>{
      self.bvSer.AutoSave(self.item).then(rec=>{
        self.item.id = rec.id;
      })
    }, AppSetting.TimeAutoSave);
  }

  deactivate() {
     logger.info('Clear Interval()');
     clearInterval(this.myInterval);
  }

  generateSlug(title) {
    this.item.title = title;
    this.item.slug = Helper.generateSlug(this.item.title);
    this.countTitle()
  }

  countChapWord() {
    const total = 25;
    this.chapWordCount = total -  Helper.wordCount(this.item['mo-ta-ngan']);
    // if (this.chapWordCount < 0)
    //   this.chapWordCount = 0;
  }

  countTitle(){
    const total = 12;
    this.titleWordCount = total -  Helper.wordCount(this.item.title);
    // if (this.titleWordCount < 0)
    // this.titleWordCount = 0;
  }
 
  enableAction(actionNum: number) : boolean{
    return ListAction.checkActionEnable(actionNum, this.item.trangThai);
  }

  runAction(actionCode: number) {
    let seft = this;
    logger.info('runAction() ', this.item);
    this.validationcontroller.validate({ object: this.item, rules: newBaiVietValidationRules }).then((result) => {
      if (result.valid) {
        console.log(result);
        this.bvSer.DoAction(actionCode,this.item).then(e => this.showSuccess()).then(function () {
          seft.router.navigateToRoute('ds-bai-viet');
        }).catch();
        logger.info('item', this.item)
      }
    })
  }

  // save() {
  //   let seft = this;
  //   console.log(this.item)
  //   this.validationcontroller.validate({ object: this.item, rules: newBaiVietValidationRules }).then((result) => {
  //     logger.info('valid create', result.valid)
  //     if (result.valid) {
  //       console.log(result);
  //       // this.item.trangThai = BaiVietStatus.NEW_02;
  //       // this.bvSer.AutoSave(this.item, false).then(e => this.showSuccess()).then(function () {
  //       this.bvSer.DoAction(3,this.item).then(e => this.showSuccess()).then(function () {
  //         seft.router.navigateToRoute('ds-bai-viet');
  //       }).catch(err=>{console.log(err)});
  //       logger.info('item', this.item)
  //     }
  //   })

  // }

  // requestApprove() {
  //   let seft = this;
  //   console.log(this.item)
  //   this.validationcontroller.validate({ object: this.item, rules: newBaiVietValidationRules }).then((result) => {
  //     if (result.valid) {
  //       console.log(result);
  //       this.bvSer.CreateAndRequestApprove(this.item).then(e => this.showSuccess()).then(function () {
  //         seft.router.navigateToRoute('ds-bai-viet');
  //       }).catch();
  //       logger.info('item', this.item)
  //     }
  //   })
  // }

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
      text: "Khi thực hiện hành động này!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Đồng ý!",
      cancelButtonText: "Không thực hiện!",
      closeOnConfirm: false,
      closeOnCancel: false
    },
      function (isConfirm) {
        cb(isConfirm)
      })
  }

}
export class GenerateSlugValueConverter{
  toView(value) {
    return value === null ? '' : value;
  }
  fromView(value) {
    return value === '' ? null : value;
  }
}
