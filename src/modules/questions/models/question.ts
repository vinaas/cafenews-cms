import { ValidationRules } from 'aurelia-validation';
import { Helper } from './../../../resources/base/helper';
import { ModelBase } from '../../../resources/base/modelbase';

export class Question extends ModelBase {

  description: string;
  difficultLevel: number;
  categories: Array<Category>;
  isRandom: boolean;
  ref: string ;
  questionType:string;
  listAnswers: Array<Answer>
    
  constructor() {
    super()
    
  }
}

export class Category {
  title: string;
  code: string
  }
  export class Answer {
    id: number;
    content: string;
    isCorrect: boolean ;
}

export const newQuestionValidationRules = ValidationRules
  .ensure((i: Question) => i.id).required()

  // .ensure((i: Question) => i.category).required()
  // .ensure((i: Question) => i.tacGia).required()
  .on(Question).rules

