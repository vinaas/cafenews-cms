
import { BaseService } from './../../../resources/base/service-base';
import axios from 'axios';
import { Filter } from '../../../resources/base/filter-base';
import { ListAction, ObjectStatus } from '../../../resources/base/status'
import {AppSetting} from '../../../appsettings/index'
import { AuthenService } from '../../../authen/authenService';
import { HistoryServices, IHistoryService } from '../../history/services/historyservices';

import { inject } from 'aurelia-framework';
import { ActionHistory } from '../../history/models/actionhistory';
import { logger } from '../logger';
import { Quiz } from '../models/quiz';

@inject(AuthenService, HistoryServices)
export class QuizService {
 
  constructor( private authenSrv: AuthenService, private historySrv: HistoryServices) {
  }
 
  async DoAction(actionCode: number, item: Quiz): Promise<Quiz> {
    item.status = ListAction.GetAfterStatus(actionCode);
    var rs
    if (item.id > 0) {
      rs = await this.Patch(item);
      this.SaveHistory(actionCode.toString(), item.id.toString(), ListAction.GetHistoryMessage(actionCode), 'TODO');
    }else {
      rs = await this.Post(item); 
      await this.SaveHistory(actionCode.toString(), rs.id.toString(), ListAction.GetHistoryMessage(actionCode), 'TODO');
    }
    logger.info('after DoAction() ', actionCode, 'item ', JSON.stringify(rs))
    return rs;
  }

  

  async GetCount(filter?: Filter): Promise<number> {
    let rec = await axios.get('api/Quizzes/count', {
        params: { where: filter.where }
    })
    return rec.data.count
  }
  async GetAll(filter?: Filter): Promise<Quiz[]> {
    logger.info('filter', filter);
      let recQuizs = await axios.get('api/Quizzes', {
          params: { filter: filter }
      })
      let dsQuiz : Quiz[] = recQuizs.data;
     
      return recQuizs.data
  }
  Get(id: number): Promise<Quiz> {
      throw new Error("Method not implemented.");
  }

  async Post(item: Quiz): Promise<any> {
    item.created = new Date();
    item.createdUserId = this.authenSrv.userInfo.userId;  
    
    item.lastModified = new Date();
    item.lastModified = this.authenSrv.userInfo.userId;

    item.quizStatus = ObjectStatus.ACTIVE;
    let rec = await axios.post("/api/Quizzes", item);
    return rec.data;
  }
  
  
  async Patch(item: Quiz): Promise<Quiz> {
    item.lastModified = new Date();
    item.lastModified = this.authenSrv.userInfo.userId;
    let rec = await axios.patch("/api/Quizzes/" + item.id, item);
    return rec.data;
  }

  async Delete(id: number): Promise<any> {
    let rec = await axios.delete("/api/Quizzes/" + id);
    return rec.data;
  }

  async DeleteMany(ids: Array<number>): Promise<any> {
    let tasks = ids.map(id => this.Delete(id))
    return await Promise.all(tasks);
  }

   async SaveHistory(actionId: string,objectId:string, message: string, note: string) : Promise<boolean> {
      var history = new ActionHistory(actionId, this.authenSrv.userInfo.userId, objectId,
                   'Quiz',message, note);
      return await this.historySrv.Post(history);
    }
    async GetHistories(objectId: string): Promise<ActionHistory[]> {
      return await this.historySrv.GetByObject(objectId, 'Quiz')
    }


  private async CheckExistsContainer(id:number):Promise<any>{
    let self = this;
    let exists = await axios.get("/api/QuizContainers/Quiz"+id).then(exists=> {
      return exists.data
    },async function (){
      let create = await axios.post("/api/QuizContainers",{name:"Quiz"+id});
      return create.data;
    });
    return exists
  }

  private async CheckExistsFiles(id:number,fileName:string):Promise<any>{
    let exists = await axios.get("/api/QuizContainers/Quiz"+id+"/files/"+fileName);
    return exists.data;
  }

  public async CreateContainer(id:number):Promise<any>{
    let create = await axios.post("/api/QuizContainers",{name:"Quiz"+id});
    return create.data;
  }

  private async DeleteFile(name:string,id:number):Promise<any>{
    let exists = await axios.delete("/api/QuizContainers/Quiz"+id+"/files/"+name);
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
