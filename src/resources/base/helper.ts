export class Helper{   
    static generateSlug(str: string) : string {
          str = str.toLowerCase();
          str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
          str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
          str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
          str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
          str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
          str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
          str = str.replace(/đ/g, "d");
          //str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");  
          /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
          //str= str.replace(/-+-/g,"-"); //thay thế 2- thành 1-  
          str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
          .replace(/\s+/g, '-') // collapse whitespace and replace by -
          .replace(/-+/g, '-'); // collapse dashes
    
          str = str.replace(/^\-+|\-+$/g, "");
          //cắt bỏ ký tự - ở đầu và cuối chuỗi 
    
          return str;
       
      }
    
    static wordCount(str : string) : number{
        if (str === undefined || str == '' || str == null) return 0;
        // let slug = this.generateSlug(str);
        // slug = slug.replace('-','') //remove dashes
        // return slug.length;

        return str
        .split(' ')
        .filter(function(n) { return n != '' })
        .length;
    }
}