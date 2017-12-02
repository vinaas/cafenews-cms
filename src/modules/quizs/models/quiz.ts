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

  listQuestionIds: {
    type: [{
      questionId: number
    }]
  };
 
  constructor() {
    super()
  }
}

export const newQuizValidationRules = ValidationRules
  .ensure((i: Quiz) => i.id).required()

  // .ensure((i: Quiz) => i.category).required()
  // .ensure((i: Quiz) => i.tacGia).required()
  .on(Quiz).rules

