import { ValidationRules } from 'aurelia-validation';
import { Helper } from './../../../resources/base/helper';
import { ModelBase } from '../../../resources/base/modelbase';

export class UserQuiz extends ModelBase {

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

export const newUserQuizValidationRules = ValidationRules
  .ensure((i: UserQuiz) => i.id).required()

  // .ensure((i: UserQuiz) => i.category).required()
  // .ensure((i: UserQuiz) => i.tacGia).required()
  .on(UserQuiz).rules

