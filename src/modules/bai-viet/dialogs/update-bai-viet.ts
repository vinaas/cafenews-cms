import { BaiViet, newBaiVietValidationRules } from './../models/bai-viet';
import { PLATFORM } from 'aurelia-pal';
import { BaiVietStatus, ListAction } from '../../../resources/base/status';
import { BaiVietService, IBaiVietService } from '../services/bai-viet-service';
import { DuyetBaiViet } from './duyet-bai-viet';
import { DangBaiViet } from './dang-bai-viet';
import { logger } from './../logger';
import { BootstrapFormRenderer } from './../../../helpers/bootstrap-form-renderer';
import { inject } from 'aurelia-framework';
import { DialogController, DialogService } from "aurelia-dialog";
import { ValidationControllerFactory, ValidationController } from "aurelia-validation";
import { ChuyenMucBaiViet } from '../../chuyen-muc-bai-viet/models/chuyen-muc-bai-viet';
import { ChuyenMucService, ChuyenMucBaiVietServiceImpl } from '../../chuyen-muc-bai-viet/services/chuyen-muc-service';
import { AppSetting } from '../../../appsettings/index'
import { Helper } from './../../../resources/base/helper';
import { TuChoiBaiViet } from './tu-choi-bai-viet';
import { DanhGiaBaiViet } from './danh-gia-bai-viet';
import { AuthenService } from '../../../authen/authenService';
import { Filter } from '../../../resources/base/filter-base';
import { TacGia } from '../../quan-ly-tac-gia/models/tac-gia';
import { TacGiaService, TacGiaServiceImpl } from '../../quan-ly-tac-gia/services/tac-gia-service';
@inject( AuthenService, DialogController, ValidationControllerFactory, ChuyenMucBaiVietServiceImpl, BaiVietService,TacGiaServiceImpl, DialogService)

export class UpdateBaiViet {
  validationcontroller: ValidationController;
  constructor( private authenSrv: AuthenService, private ctrl: DialogController, private controllerFactory, private chuyenMucSer: ChuyenMucService, private baiVietSrv: BaiVietService,
    private tacGiaSrv: TacGiaService, private dialogService: DialogService) {
    this.validationcontroller = controllerFactory.createForCurrentScope();
    this.validationcontroller.addRenderer(new BootstrapFormRenderer());
  }

  get getTieuDe() {
    if (this.item.id) return "Cập nhật";
    return "Thêm mới";
  }

  item: BaiViet;
  itemBaiViet: BaiViet[];
  daDangFilter: Filter = {
   order: "date DESC", where: {
      "trangThai": BaiVietStatus.PUBLISHED_014 
    }
  };
  dsBaiVietDaDang: BaiViet[];
  dsTacGia: TacGia[];
  dsChuyenMuc: ChuyenMucBaiViet[];

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

  async activate(dto: BaiViet) {
    this.item = dto;
    let sefl = this;
    await Promise.all([
      this.chuyenMucSer.GetAll().then(rec => sefl.dsChuyenMuc = rec)
    ]);

    this.baiVietSrv.GetAll(this.daDangFilter).then(rec => this.dsBaiVietDaDang = rec); 
    this.tacGiaSrv.GetAll().then(rec => this.dsTacGia = rec); 
    
    logger.info('BaiViet dto', dto);
    logger.info('ChuyenMuc ', this.dsChuyenMuc);
    this.countTitle();
    this.countChapWord();
  }

  generateSlug() {
    this.item.slug = Helper.generateSlug(this.item.title);
    this.countTitle()
  }

  countChapWord() {
    const total = 30;
    this.chapWordCount = total - Helper.wordCount(this.item['mo-ta-ngan']);
    // if (this.chapWordCount < 0)
    //   this.chapWordCount = 0;
  }

  countTitle() {
    const total = 12;
    this.titleWordCount = total - Helper.wordCount(this.item.title);
    // if (this.titleWordCount < 0)
    // this.titleWordCount = 0;
  }

  enableAction(actionNum: number): boolean {
    return ListAction.checkActionEnable(actionNum, this.item.trangThai);
  }

  async runAction(actionCode: number) {
    let seft = this;
    logger.info('runAction() ', this.item);
    if (actionCode == 6) { //Khi Duyệt Bài viết, chọn báo để Duyệt
       await this.dialogService.open({ viewModel: DuyetBaiViet, model: this.item }).whenClosed((result) => {
        if (!result.wasCancelled) {
          let out = new BaiViet();
          this.item = result.output;
          this.item.dangTrenBao.forEach(element => {
            if (element.websiteId == "BAOPHUONGDONG") {
              let publishItem: BaiViet = Object.assign({}, this.item);  //BAO: copy objects
              //clone thành bài viết mới và đăng 
              publishItem.approveUserId = "01";
              publishItem.category = element.category;
              publishItem.approveNotes = element.notes;
              publishItem.websiteId = element.websiteId;
              logger.info("PUBLISH to BAOPHUONGDONG", publishItem)
              this.baiVietSrv.ApproveForSite(publishItem, element.websiteId).then(_ => this.showSuccess())
              
              .catch(err => {
                this.showError(err)
              })
            }
          });

          this.validationcontroller.validate({ object: this.item, rules: newBaiVietValidationRules }).then((result) => {
            if (result.valid) {
              this.item.approveDate = new Date();
              this.item.approveUserId = this.authenSrv.userInfo.userId;
              this.baiVietSrv.DoAction(actionCode, this.item).then(_ => {
                this.showSuccess()
                this.ctrl.ok(this.item);
              }).catch();
            }
          })

        } else {
          logger.info("không chọn Duyệt"); //không chọn Duyệt
          return ; 
        }
      });
    }else if (actionCode == 7) {
      await this.dialogService.open({ viewModel: DanhGiaBaiViet, model: this.item }).whenClosed((result) => {
        if (!result.wasCancelled) {
          let out = new BaiViet();
          this.item = result.output;
          this.validationcontroller.validate({ object: this.item, rules: newBaiVietValidationRules }).then((result) => {
            if (result.valid) {
              console.log(result);
              this.baiVietSrv.DoAction(actionCode, this.item).then(_ => {
                this.showSuccess()
                this.ctrl.ok(this.item);
              }).catch();
            }
          })

        } else {
          logger.info("không chọn Duyệt"); //không chọn Duyệt
          return ; 
        }
      });
    }else if (actionCode == 14){
      await this.dialogService.open({ viewModel: DangBaiViet, model: this.item }).whenClosed((result) => {
       if (!result.wasCancelled) {
         let out = new BaiViet();
         this.item = result.output;
         this.validationcontroller.validate({ object: this.item, rules: newBaiVietValidationRules }).then((result) => {
           if (result.valid) {
             console.log(result);
             this.item.date = this.item.publishDate
             this.baiVietSrv.DoAction(actionCode, this.item).then(_ => {
               this.showSuccess()
               this.ctrl.ok(this.item);
             }).catch();
           }
         })

       } else {
         logger.info("không chọn Duyệt"); //không chọn Duyệt
         return ; 
       }
     });
   }
   else if (actionCode == 141){
    await this.dialogService.open({ viewModel: TuChoiBaiViet, model: this.item }).whenClosed((result) => {
     if (!result.wasCancelled) {
       let out = new BaiViet();
       this.item = result.output;
       this.validationcontroller.validate({ object: this.item, rules: newBaiVietValidationRules }).then((result) => {
         if (result.valid) {
           console.log(result);
           this.baiVietSrv.DoAction(actionCode, this.item).then(_ => {
             this.showSuccess()
             this.ctrl.ok(this.item);
           }).catch();
         }
       })

     } else {
       logger.info("không chọn Duyệt"); //không chọn Duyệt
       return ; 
     }
   });
 }
   else if (actionCode == 18){
       await this.dialogService.open({ viewModel: TuChoiBaiViet, model: this.item }).whenClosed((result) => {
        if (!result.wasCancelled) {
          let out = new BaiViet();
          this.item = result.output;
          this.validationcontroller.validate({ object: this.item, rules: newBaiVietValidationRules }).then((result) => {
            if (result.valid) {
              console.log(result);
              this.baiVietSrv.DoAction(actionCode, this.item).then(_ => {
                this.showSuccess()
                this.ctrl.ok(this.item);
              }).catch();
            }
          })

        } else {
          logger.info("không chọn Duyệt"); //không chọn Duyệt
          return ; 
        }
      });
    }
    else {
      this.validationcontroller.validate({ object: this.item, rules: newBaiVietValidationRules }).then((result) => {
        if (result.valid) {
          console.log(result);
          this.baiVietSrv.DoAction(actionCode, this.item).then(_ => {
            this.showSuccess()
            this.ctrl.ok(this.item);
          }).catch();
          logger.info('item', this.item)
        }
      })
    } 
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
