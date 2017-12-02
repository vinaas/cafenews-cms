import * as moment from 'moment';
import {QuizStatus} from '../base/status';

export class BaiVietNameValueConverter{
  toView(value){
    if(value)
      {
        return QuizStatus.GetStatusName(value);
      }
  }
}

