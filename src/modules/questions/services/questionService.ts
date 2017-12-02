
import { BaseService } from './../../../resources/base/service-base';
import axios from 'axios';
import { Filter } from '../../../resources/base/filter-base';
import { QuestionActions } from '../../../resources/base/questionStatus'
import {AppSetting} from '../../../appsettings/index'
import { AuthenService } from '../../../authen/authenService';
import { HistoryServices, IHistoryService } from '../../history/services/historyservices';

import { inject } from 'aurelia-framework';
import { ActionHistory } from '../../history/models/actionhistory';
import { logger } from '../logger';
import { Question } from '../models/question';



export class QuestionService {
 
  constructor( private authenSrv: AuthenService, private historySrv: HistoryServices) {
  }
 
  async DoAction(actionCode: number, item: Question): Promise<Question> {
    item.status = QuestionActions.GetAfterStatus(actionCode);
    var rs
    if (item.id > 0) {

      
      rs = await this.Patch(item);
      this.SaveHistory(actionCode.toString(), item.id.toString(), QuestionActions.GetHistoryMessage(actionCode), 'TODO');
      
    }else {
      rs = await this.Post(item); 
      await this.SaveHistory(actionCode.toString(), rs.id.toString(), QuestionActions.GetHistoryMessage(actionCode), 'TODO');
    }
    return rs;
  }

  

  async GetCount(filter?: Filter): Promise<number> {
    let rec = await axios.get('api/Questions/count', {
        params: { where: filter.where }
    })
    return rec.data.count
  }
  async GetAll(filter?: Filter): Promise<Question[]> {
    logger.info('filter', filter);
      let recQuestions = await axios.get('api/Questions', {
          params: { filter: filter }
      })
      let dsQuestion : Question[] = recQuestions.data;
     
      return recQuestions.data
  }
  Get(id: number): Promise<Question> {
      throw new Error("Method not implemented.");
  }

  async Post(item: Question): Promise<any> {
   
    item.lastModified = new Date();
    item.lastModified = this.authenSrv.userInfo.userId;
    
    let rec = await axios.post("/api/Questions", item);
    return rec.data;
  }

  
  async Patch(item: Question): Promise<Question> {
    // if (item.trangThai == QuestionStatus.APPROVEREQUEST_04 || item.trangThai == QuestionStatus.EDITATAPPROVE){
    //   item.trangThai = QuestionStatus.EDITATAPPROVE; 
    //   item.modifiedDate = new Date();
    //   item.modifiedUserId = item.userId; //FIX sau
    // }else if (item.trangThai == QuestionStatus.PUBLISHED_014){
    // } else if(item.trangThai == QuestionStatus.DRAFT_01)
    // {
      
    // }
    // else{
    //   item.trangThai = QuestionStatus.EDIT_03; 
    //   item.modifiedDate = new Date();
    //   item.modifiedUserId = item.userId; //FIX sau
    // }
    let rec = await axios.patch("/api/Questions/" + item.id, item);
    return rec.data;
  }

  async Delete(id: number): Promise<any> {
    let rec = await axios.delete("/api/Questions/" + id);
    return rec.data;
  }

  async DeleteMany(ids: Array<number>): Promise<any> {
    let tasks = ids.map(id => this.Delete(id))
    return await Promise.all(tasks);
  }

   async SaveHistory(actionId: string,objectId:string, message: string, note: string) : Promise<boolean> {
      var history = new ActionHistory(actionId, this.authenSrv.userInfo.userId, objectId,
                   'Question',message, note);
      return await this.historySrv.Post(history);
    }
    async GetHistories(objectId: string): Promise<ActionHistory[]> {
      return await this.historySrv.GetByObject(objectId, 'Question')
    }


  private async CheckExistsContainer(id:number):Promise<any>{
    let self = this;
    let exists = await axios.get("/api/QuestionContainers/Question"+id).then(exists=> {
      return exists.data
    },async function (){
      let create = await axios.post("/api/QuestionContainers",{name:"Question"+id});
      return create.data;
    });
    return exists
  }

  private async CheckExistsFiles(id:number,fileName:string):Promise<any>{
    let exists = await axios.get("/api/QuestionContainers/Question"+id+"/files/"+fileName);
    return exists.data;
  }

  public async CreateContainer(id:number):Promise<any>{
    let create = await axios.post("/api/QuestionContainers",{name:"Question"+id});
    return create.data;
  }

  private async DeleteFile(name:string,id:number):Promise<any>{
    let exists = await axios.delete("/api/QuestionContainers/Question"+id+"/files/"+name);
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
