import { BaiViet } from './../models/bai-viet';
import { BaseService } from './../../../resources/base/service-base';
import axios from 'axios';
import { Filter } from '../../../resources/base/filter-base';
import {BaiVietStatus, ListAction } from '../../../resources/base/status'
import {AppSetting} from '../../../appsettings/index'
import { AuthenService } from '../../../authen/authenService';
import { HistoryServices, IHistoryService } from '../../history/services/historyservices';

import { inject } from 'aurelia-framework';
import { ActionHistory } from '../../history/models/actionhistory';
import { logger } from '../logger';

export interface IBaiVietService extends BaseService {

  DoAction(actionCode : number, item : BaiViet) : Promise<BaiViet>

  Patch(item: BaiViet): Promise<BaiViet>
  CreateAndRequestApprove(item : BaiViet) : Promise<any>
  RequestApprove_4(item : BaiViet) : Promise<any>

  Approve( item): Promise<any>
  Publish(item) : Promise<any>
  UnPublish(item) : Promise<any>
    
  RejectApprove(item : BaiViet) : Promise<any>
  RejectPublish(item : BaiViet) : Promise<any>

  //for specific website
  ApproveForSite(item : BaiViet, websiteId : string): Promise<any>

  AutoSave(item : BaiViet): Promise<any>
}

@inject(AuthenService,HistoryServices )
export class BaiVietService implements IBaiVietService {
 
  constructor( private authenSrv: AuthenService, private historySrv: HistoryServices) {
  }
 
  async DoAction(actionCode: number, item: BaiViet): Promise<BaiViet> {
    item.trangThai = ListAction.GetAfterStatus(actionCode);
    var rs
    if (item.id > 0) {

      
      rs = await this.Patch(item);
      this.SaveHistory(actionCode.toString(), item.id.toString(), ListAction.GetHistoryMessage(actionCode), 'TODO');
      
    }else {
      rs = await this.Post(item); 
      await this.SaveHistory(actionCode.toString(), rs.id.toString(), ListAction.GetHistoryMessage(actionCode), 'TODO');
    }
    return rs;
  }

  async UnPublish(item: BaiViet): Promise<any> {
    let updateItem = new BaiViet();
    updateItem.id = item.id;
    updateItem.unPublishUserId = this.authenSrv.userInfo.userName;
    updateItem.unPublishDate = new Date();
    updateItem.trangThai = BaiVietStatus.UNPUBLISH_016; 
    return await this.UpdateStatus(updateItem);
  }

  async RejectApprove(item: BaiViet): Promise<any> {
    let updateItem = new BaiViet();
    updateItem.id = item.id;
    updateItem.unApproveDate = new Date();
    updateItem.unApproveNotes = item.unApproveNotes;
    updateItem.unApproveUserId = item.unApproveUserId;
    updateItem.trangThai = BaiVietStatus.APPROVEREJECTED_05; 
    return await this.UpdateStatus(updateItem);
  }

  async RejectPublish(item: BaiViet): Promise<any> {
    let updateItem = new BaiViet();
    updateItem.id = item.id;
    updateItem.trangThai = BaiVietStatus.PUBLISHREJECTED_0141; 
    return await this.UpdateStatus(updateItem);
  }

  async Publish(item : BaiViet): Promise<any> {
    
    item.trangThai = BaiVietStatus.PUBLISHED_014;
   // updateItem.publishDate = new Date(); //ngày đăng có thể được thiết lập
    item.publishNotes = item.publishNotes;
    item.publishUserId = item.publishUserId;
    return await this.UpdateStatus(item);
  }

  async RequestApprove_4(item: BaiViet): Promise<any> {
    // let updateItem = new BaiViet();
    // updateItem.id = item.id;
    item.userId = this.authenSrv.userInfo.userId;
    item.trangThai = BaiVietStatus.APPROVEREQUEST_04; 
    item.date = new Date();
    return await this.UpdateStatus(item);
  }

  async ApproveForSite(item: BaiViet, websiteId : string): Promise<any> {
  //  let apiEP = this.getAPIEndPoint(websiteId);

    item.id = undefined;  //BAO: vậy mới cho phép tạo mới
    item.websiteId = websiteId;  

    item.approveUserId = this.authenSrv.userInfo.userName;
    item.trangThai = BaiVietStatus.APPROVED_011;
    item.approveDate = new Date();
    this.DoAction(112, item);
  //  return await axios.post(apiEP + "/api/BaiViets", item);
  }

  async AutoSave(item:BaiViet):Promise<BaiViet>{
    if (item.slug === undefined || item.slug == '') return new BaiViet();
    return await this.DoAction(0, item);
  }

  private getAPIEndPoint(websiteId: string) : string {
    let apiEP = AppSetting.apiEndPoint;
    if (websiteId == "BAOPHUONGDONG")
    {
      apiEP = AppSetting.baophuongdongAPIEndPoint ; 
    }
    return apiEP; 
  }

  async Approve(item: BaiViet): Promise<any> {
    let updateItem = item;
    //updateItem.id = item.id;
    updateItem.websiteId = "ALL"; 
    updateItem.trangThai = BaiVietStatus.MULTIAPPROVED_06;
    updateItem.approveDate = new Date();
    updateItem.approveNotes = item.approveNotes;
    updateItem.approveUserId = item.approveUserId;
    return await this.UpdateStatus(updateItem);
  }

  private async UpdateStatus(item : BaiViet) : Promise<any> {
    console.log("id " + item.id + ",status: " + item.trangThai);
    let rec = await axios.patch("/api/BaiViets/" , item);
    return rec.data;
  }

  async CreateAndRequestApprove(item: BaiViet): Promise<BaiViet> {
    if (item.id > 0) {
      return this.RequestApprove_4(item);
    }

    item.userId = this.authenSrv.userInfo.userId;
    item.trangThai = BaiVietStatus.APPROVEREQUEST_04; 
    item.date = new Date();
    var rs =  await this.Post(item);

    //lưu vào lịch sử hệ thống 
    var message = 'đã tạo và gửi duyệt bài viết';
    var notes = '';
    var history = new ActionHistory('CreateAndRequestApprove', item.userId, rs.id.toString(),'BaiViet', message  , notes );
    this.historySrv.Post(history);

    return rs; 
  }

  async GetCount(filter?: Filter): Promise<number> {
    let rec = await axios.get('api/BaiViets/count', {
        params: { where: filter.where }
    })
    return rec.data.count
  }
  async GetAll(filter?: Filter): Promise<BaiViet[]> {
    logger.info('filter', filter);
      let recBaiViets = await axios.get('api/BaiViets', {
          params: { filter: filter }
      })
      let dsBaiViet : BaiViet[] = recBaiViets.data;
      dsBaiViet.forEach(element => {
        element.tenTrangThai = BaiVietStatus.GetStatusName(element.trangThai);
      });
      return recBaiViets.data
  }
  Get(id: number): Promise<BaiViet> {
      throw new Error("Method not implemented.");
  }

  async Post(item: BaiViet): Promise<any> {
   
    item.modifiedDate = new Date();
    item.modifiedUserId = this.authenSrv.userInfo.userId;
    
    let rec = await axios.post("/api/BaiViets", item);
    return rec.data;
  }

  async Put(item: BaiViet): Promise<BaiViet> {
    if(typeof(item.result) == "object" && item.result.length>0)
      {
        let result = await this.Attachment(item).then(value =>{
          item["anh-dai-dien"]=value.result.files.file[0].name;
        });
      }
    let rec = await axios.put("/api/BaiViets/" + item.id, item);
    return rec.data;
  }

  async Patch(item: BaiViet): Promise<BaiViet> {
    // if (item.trangThai == BaiVietStatus.APPROVEREQUEST_04 || item.trangThai == BaiVietStatus.EDITATAPPROVE){
    //   item.trangThai = BaiVietStatus.EDITATAPPROVE; 
    //   item.modifiedDate = new Date();
    //   item.modifiedUserId = item.userId; //FIX sau
    // }else if (item.trangThai == BaiVietStatus.PUBLISHED_014){
    // } else if(item.trangThai == BaiVietStatus.DRAFT_01)
    // {
      
    // }
    // else{
    //   item.trangThai = BaiVietStatus.EDIT_03; 
    //   item.modifiedDate = new Date();
    //   item.modifiedUserId = item.userId; //FIX sau
    // }
    item.modifiedDate = new Date();
    item.modifiedUserId = this.authenSrv.userInfo.userId;
    
    let rec = await axios.patch("/api/BaiViets/" + item.id, item);
    return rec.data;
  }

  async Delete(id: number): Promise<any> {
    let rec = await axios.delete("/api/BaiViets/" + id);
    return rec.data;
  }

  async DeleteMany(ids: Array<number>): Promise<any> {
    let tasks = ids.map(id => this.Delete(id))
    return await Promise.all(tasks);
  }

   async SaveHistory(actionId: string,objectId:string, message: string, note: string) : Promise<boolean> {
      var history = new ActionHistory(actionId, this.authenSrv.userInfo.userId, objectId,
                   'BaiViet',message, note);
      return await this.historySrv.Post(history);
    }
    async GetHistories(objectId: string): Promise<ActionHistory[]> {
      return await this.historySrv.GetByObject(objectId, 'BaiViet')
    }


  async Attachment(item: BaiViet):Promise<any>{
    
    var check = await this.CheckExistsContainer(item.id);
    console.log(check)
    let att = await axios.post("/api/BaiVietContainers/"+check.name+"/upload",this.ProgessFileAttachment(item.result), {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
     return att.data;
    
  }

  private async CheckExistsContainer(id:number):Promise<any>{
    let self = this;
    let exists = await axios.get("/api/BaiVietContainers/baiviet"+id).then(exists=> {
      return exists.data
    },async function (){
      let create = await axios.post("/api/BaiVietContainers",{name:"baiviet"+id});
      return create.data;
    });
    return exists
  }

  private async CheckExistsFiles(id:number,fileName:string):Promise<any>{
    let exists = await axios.get("/api/BaiVietContainers/baiviet"+id+"/files/"+fileName);
    return exists.data;
  }

  public async CreateContainer(id:number):Promise<any>{
    let create = await axios.post("/api/BaiVietContainers",{name:"baiviet"+id});
    return create.data;
  }

  private async DeleteFile(name:string,id:number):Promise<any>{
    let exists = await axios.delete("/api/BaiVietContainers/baiviet"+id+"/files/"+name);
    return exists.data;
  }
  
  private ProgessFileAttachment(item:any):FormData
  {
    let formData = new FormData();
    if (item.length<=0) {
      return formData;
    }
    
    for (let i = 0; i < item.length; i++) {
        formData.append('file', item[i]);
    }
    
    return formData;
  }
}
