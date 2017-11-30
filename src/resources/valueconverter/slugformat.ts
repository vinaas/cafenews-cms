import { Helper} from './../../resources/base/helper';
export class SlugFormatValueConverter{
  toView(value){
    if(value)
      {
        return Helper.generateSlug(value);
      }
  }
}