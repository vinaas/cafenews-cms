import { ValidationRules } from 'aurelia-validation';
import { Helper } from './../../../resources/base/helper';
import { ModelBase } from './../../../resources/base/modelbase';

export class Quiz extends ModelBase {
  
  startTime: Date;
  endTime: Date;
  quizInfo: {
    quizTime: Date;
    quizName: string
  };
  quizStatus: string;
  totalTime: number;    
  numberOfQuestions: number
  totalQuestions: number

  listQuestionIds: number[] = [];
 
  constructor() {
    super()
  }
}


export const newQuizValidationRules = ValidationRules
  .ensure((i: Quiz) => i.totalQuestions).required()
  .ensure((i: Quiz) => i.numberOfQuestions).required()
  .ensure((i: Quiz) => i.startTime).required()
  .ensure((i: Quiz) => i.totalQuestions).required()
  .on(Quiz).rules

