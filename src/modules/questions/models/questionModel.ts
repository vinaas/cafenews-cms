import { ValidationRules } from 'aurelia-validation';
import { Helper } from './../../../resources/base/helper';
import { ModelBase } from '../../../resources/base/modelbase';

export class Question extends ModelBase {

  description: string;
  difficultLevel: number;
  categories: [
    {
      title: string;
      code: string
    }
  ];
  isRandom: {
    type: boolean
  };
  ref: {
    type: string
  };
  questionType: {
    type: string
  };
  listAnswers: {
    type: [
      {
        id: {
          type: number
        };
        content: {
          type: string
        };
        isCorrect: {
          type: boolean;
          default: false
        };
        answerByUser: {
          type: boolean;
          default: false
        }
      }
    ]
  }

  constructor() {
    super()

  }
}

export const newQuestionValidationRules = ValidationRules
  .ensure((i: Question) => i.id).required()

  // .ensure((i: Question) => i.category).required()
  // .ensure((i: Question) => i.tacGia).required()
  .on(Question).rules

