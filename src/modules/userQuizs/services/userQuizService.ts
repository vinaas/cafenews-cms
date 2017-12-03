
import { BaseService } from './../../../resources/base/service-base';
import axios from 'axios';
import { Filter } from '../../../resources/base/filter-base';
import { UserQuizActions } from '../../../resources/base/UserQuizStatus'
import {AppSetting} from '../../../appsettings/index'
import { AuthenService } from '../../../authen/authenService';
import { HistoryServices, IHistoryService } from '../../history/services/historyservices';

import { inject } from 'aurelia-framework';
import { ActionHistory } from '../../history/models/actionhistory';
import { logger } from '../logger';
import { UserQuiz } from '../models/UserQuiz';



export class UserQuizService {
 
  constructor( private authenSrv: AuthenService, private historySrv: HistoryServices) {
  }
 
  async DoAction(actionCode: number, item: UserQuiz): Promise<UserQuiz> {
    item.status = UserQuizActions.GetAfterStatus(actionCode);
    var rs
    if (item.id > 0) {

      
      rs = await this.Patch(item);
      this.SaveHistory(actionCode.toString(), item.id.toString(), UserQuizActions.GetHistoryMessage(actionCode), 'TODO');
      
    }else {
      rs = await this.Post(item); 
      await this.SaveHistory(actionCode.toString(), rs.id.toString(), UserQuizActions.GetHistoryMessage(actionCode), 'TODO');
    }
    return rs;
  }

  

  async GetCount(filter?: Filter): Promise<number> {
    let rec = await axios.get('api/UserQuizs/count', {
        params: { where: filter.where }
    })
    return rec.data.count
  }
  async GetAll(filter?: Filter): Promise<UserQuiz[]> {
    logger.info('filter', filter);
      let recUserQuizs = await axios.get('api/UserQuizs', {
          params: { filter: filter }
      })
      let dsUserQuiz : UserQuiz[] = recUserQuizs.data;
     
      return recUserQuizs.data
  }
  Get(id: number): Promise<UserQuiz> {
      throw new Error("Method not implemented.");
  }

  async Post(item: UserQuiz): Promise<any> {
   
    item.lastModified = new Date();
    item.lastModified = this.authenSrv.userInfo.userId;
    
    let rec = await axios.post("/api/UserQuizs", item);
    return rec.data;
  }

  
  async Patch(item: UserQuiz): Promise<UserQuiz> {
    // if (item.trangThai == UserQuizStatus.APPROVEREQUEST_04 || item.trangThai == UserQuizStatus.EDITATAPPROVE){
    //   item.trangThai = UserQuizStatus.EDITATAPPROVE; 
    //   item.modifiedDate = new Date();
    //   item.modifiedUserId = item.userId; //FIX sau
    // }else if (item.trangThai == UserQuizStatus.PUBLISHED_014){
    // } else if(item.trangThai == UserQuizStatus.DRAFT_01)
    // {
      
    // }
    // else{
    //   item.trangThai = UserQuizStatus.EDIT_03; 
    //   item.modifiedDate = new Date();
    //   item.modifiedUserId = item.userId; //FIX sau
    // }
    let rec = await axios.patch("/api/UserQuizs/" + item.id, item);
    return rec.data;
  }

  async Delete(id: number): Promise<any> {
    let rec = await axios.delete("/api/UserQuizs/" + id);
    return rec.data;
  }

  async DeleteMany(ids: Array<number>): Promise<any> {
    let tasks = ids.map(id => this.Delete(id))
    return await Promise.all(tasks);
  }

   async SaveHistory(actionId: string,objectId:string, message: string, note: string) : Promise<boolean> {
      var history = new ActionHistory(actionId, this.authenSrv.userInfo.userId, objectId,
                   'UserQuiz',message, note);
      return await this.historySrv.Post(history);
    }
    async GetHistories(objectId: string): Promise<ActionHistory[]> {
      return await this.historySrv.GetByObject(objectId, 'UserQuiz')
    }


  private async CheckExistsContainer(id:number):Promise<any>{
    let self = this;
    let exists = await axios.get("/api/UserQuizContainers/UserQuiz"+id).then(exists=> {
      return exists.data
    },async function (){
      let create = await axios.post("/api/UserQuizContainers",{name:"UserQuiz"+id});
      return create.data;
    });
    return exists
  }

  private async CheckExistsFiles(id:number,fileName:string):Promise<any>{
    let exists = await axios.get("/api/UserQuizContainers/UserQuiz"+id+"/files/"+fileName);
    return exists.data;
  }

  public async CreateContainer(id:number):Promise<any>{
    let create = await axios.post("/api/UserQuizContainers",{name:"UserQuiz"+id});
    return create.data;
  }

  private async DeleteFile(name:string,id:number):Promise<any>{
    let exists = await axios.delete("/api/UserQuizContainers/UserQuiz"+id+"/files/"+name);
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
