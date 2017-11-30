export class AppSetting {
  // Production
  static readonly apiEndPoint: string = 'http://45.77.45.94:4000';
  static readonly baophuongdongAPIEndPoint: string = 'http://45.77.45.94:4000';

  // static readonly apiEndPoint: string = 'http://localhost:5000';
  // static readonly baophuongdongAPIEndPoint: string = 'http://localhost:5000';
  
  static readonly UploadFolder = 'anh-dai-dien'
  static readonly UploadPath: string = AppSetting.apiEndPoint + '/api/BaiVietContainers/' + AppSetting.UploadFolder;
  static readonly DownloadPath: string = AppSetting.apiEndPoint + '/api/BaiVietContainers/' + AppSetting.UploadFolder + '/download';

  static readonly TimeAutoSave:number = 10000;
}

