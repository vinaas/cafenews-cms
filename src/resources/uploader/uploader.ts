import { inject } from 'aurelia-dependency-injection';
import { childViewer } from './../../helpers/child-viewer';
import { bindable, bindingMode } from 'aurelia-framework';
import axios from 'axios';
import { AppSetting } from '../../appsettings/index';
@inject(Element)
export class UploaderCustomElement {
    @bindable uri
    @bindable({ defaultBindingMode: bindingMode.twoWay }) value;
    selectedFiles
    container
    name
    constructor(private el) {
    }
    filesChange() {
        let btn = this.el.querySelector('input')
        if (this.selectedFiles[0] == '')
            return;
        btn.setAttribute('disabled', 'disabled')
        let formData = new FormData();
        formData.append('upload', this.selectedFiles[0]);
        axios.post(this.uri, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            let rec = res.data.result.files.upload[0]
            this.value = AppSetting.DownloadPath + '/' + rec.name

        }).then(_ => {
            btn.removeAttribute('disabled')
        }).catch(err => {
        })

    }

}
