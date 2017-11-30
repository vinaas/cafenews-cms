import * as moment from 'moment';
export class DateFormatValueConverter{
  toView(value){
    if(value)
      {
        if(typeof value != "object" && (value.split('/').length>1))
          {
            let newDate = new Date(moment(value,"DD/MM/YYYY").toISOString());
            return moment(newDate).format("DD/MM/YYYY");
          }
          else
            return moment(value).format("DD/MM/YYYY");
      }
  }
}

export class DateTimeFormatValueConverter{
  toView(value){
    if (value)
      {
        return moment(value).format("DD/MM/YYYY HH:mm")
      }
  }
}

export class DateFilterFormatValueConverter{
  toView(value){
    if (value)
      {
        return moment(value).format("DD/MM/YYYY")
      }
  }
}
