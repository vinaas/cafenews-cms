import { logger } from './../../../authen/logger';
import { BaseService } from './../../../resources/base/service-base';
import axios from 'axios';
import { Filter } from '../../../resources/base/filter-base';
import {QuizStatus } from '../../../resources/base/status'
import {AppSetting} from '../../../appsettings/index'
import { AuthenService } from '../../../authen/authenService';
import { inject } from 'aurelia-framework';
import { ActionHistory } from '../models/actionhistory';

export interface IHistoryService{ 
    GetByObject(objectId: string, objectType: string) : Promise<Array<any>>
    GetAll(filter?: Filter): Promise<Array<any>>
    GetCount(filter?: Filter): Promise<number>
    Post(item): Promise<any>
}

@inject(AuthenService)
export class HistoryServices implements IHistoryService {
    async GetByObject(objectId: string, objectType: string): Promise<any[]> {
        let filter: Filter = { order: "date DESC", where: { 
             "objectId" : objectId, 
             "objectType": objectType 
          } };

        return await this.GetAll(filter); 
    }
    
    async GetAll(filter?: Filter): Promise<any[]> {
        let recBaiViets = await axios.get('api/ActionHistories', {
            params: { filter: filter }
        })
        return recBaiViets.data
    }
    GetCount(filter?: Filter): Promise<number> {
        throw new Error("Method not implemented.");
    }
    async Post(item: ActionHistory): Promise<any> {
        let rec = await axios.post("/api/ActionHistories", item);
        return rec.data;
    }

    constructor( private authenSrv: AuthenService) {
    }
}