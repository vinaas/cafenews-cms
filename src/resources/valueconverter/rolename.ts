import { Helper} from './../../resources/base/helper';
export class RoleNameValueConverter{
  toView(value){
    if(value)
      {
          let listRoles = [
            [1, "Admin"],
            [2, "Học Viên"],
            [3, "Giáo Viên"]
          ]  
          let roleName:string = "";
          listRoles.forEach(element => {
            if (value == element[0]){
              roleName = element[1].toString();
            }
          });
          return roleName;
      }
  }
}