import { ValidationRules } from 'aurelia-validation';
import { TacGia } from '../../quan-ly-tac-gia/models/tac-gia';

import { ChuyenMucBaiViet } from '../../chuyen-muc-bai-viet/models/chuyen-muc-bai-viet';
export class ActionHistory {
        "actionId": string 
        "userId": string 
        "objectId" : string 
        "objectType" : string 
        "date": Date 
        "message":  string 
        "notes":  string 
    
    constructor(actionId: string, userId: string, objectId: string, objectType : string, message: string, note:string)
        {
        this.actionId = objectType.toString() + '_' + actionId.toString();
        console.log(this.actionId);
        this.userId  = userId;
        this.objectId = objectId;
        this.objectType = objectType;
        this.message = message;
        this.notes = note; 
        this.date = new Date();
    }
    // "properties": {
    //     "actionId": {
    //       "type": "string",
    //       "required": true
    //     },
    //     "userId": {
    //       "type": "string",
    //       "required": true
    //     },
    //     "objectId" : {
    //       "type": "string",
    //       "required": true
    //     },
    //     "objectType" : {
    //       "type": "string",
    //       "required": true
    //     },
    //     "date": {
    //       "type": "date",
    //       "required": true
    //     },
    //     "message": {
    //       "type": "string"
    //     },
    //     "notes": {
    //       "type": "string"
    //     }
    //   }
}
