import { PLATFORM } from 'aurelia-pal';
// import $ from 'jquery';
import * as moment from 'moment';
import { BindingEngine, computedFrom } from "aurelia-binding";
import { inject } from 'aurelia-dependency-injection';
import { bindable } from 'aurelia-framework';
import * as _ from 'lodash';
const $ = PLATFORM.global.$
@inject(BindingEngine)
export class DashBoard {
  ckId: any;
  d: any = {}
  person: any = { fn: 'tung', ln: 'pham' };
  ckEditorValue = 'I am from viewmodel'
  ckconfig = {
    extraPlugins: 'uploadimage,customupload',
    uploadUrl: 'http://5.189.139.30:4000/api/BaiVietContainers/tungtest/upload'
  }
  private personOrigin = Object.assign({}, this.person);
  constructor() {
  }
  get isDisable() {
    return _.isEqual(this.person, this.personOrigin);
  }
  async doClick() {
    let promise = await this.timerDo(1000);
    return promise;
  }
  timerDo(ms = 0) {
    return new Promise((resolve, reject) => { setTimeout(() => { resolve(true) }, ms) });
  }

  goPage(pageName: string){
    if (pageName == 'TaoMoi'){
      window.location.href = '/#/admin/tao-bai-viet'
    }else if (pageName == 'ChoDuyet'){
      window.location.href = '/#/admin/ds-bai-viet-cho-duyet'
    }else if (pageName == 'DaDang'){
      window.location.href = '/#/admin/ds-bai-viet-da-dang'
    }
  }
  attached() {

    $('#data').jstree({
      'core': {
        'data': [
          {
            "text": "Root node", "children": [
              { "text": "Child node 1" },
              { "text": "Child node 2" }
            ]
          }
        ]
      }, "plugins": ["checkbox"]
    });

    // setTimeout(() => {
    //   this.ckInstance.on('fileUploadRequest', function (evt) {
    //     alert('ok')
    //     console.log('request', evt)
    //     var xhr = evt.data.fileLoader.xhr;

    //     xhr.setRequestHeader('Cache-Control', 'no-cache');
    //     xhr.setRequestHeader('X-File-Name', this.fileName);
    //     // xhr.setRequestHeader('X-Frame-Options', 'sameorigin');
    //     xhr.setRequestHeader('X-File-Size', this.total);
    //     xhr.send(this.file);

    //     // Prevented the default behavior.
    //     // evt.stop();
    //   });
    //   this.ckInstance.on('fileUploadResponse', function (evt) {
    //     // Prevent the default response handler.
    //     evt.stop();
    //     console.log('evt', evt)

    //     // Get XHR and response.
    //     var data = evt.data,
    //       xhr = data.fileLoader.xhr,
    //       response = xhr.responseText.split('|');

    //     if (response[1]) {
    //       // An error occurred during upload.
    //       data.message = response[1];
    //       evt.cancel();
    //     } else {
    //       data.url = response[0];
    //     }
    //   });
    // }, 1000)

  }
}
