import * as moment from 'moment';
import {BaiVietStatus} from '../base/status';

export class BaiVietNameValueConverter{
  toView(value){
    if(value)
      {
        return BaiVietStatus.GetStatusName(value);
      }
  }
}

