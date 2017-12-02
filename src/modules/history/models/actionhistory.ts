import { ValidationRules } from 'aurelia-validation';

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
 
}
