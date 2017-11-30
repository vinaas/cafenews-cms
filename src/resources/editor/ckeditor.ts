import { PLATFORM } from 'aurelia-pal';
import { bindable, bindingMode, inject, customAttribute } from 'aurelia-framework';
@inject(Element)
@customAttribute('ckeditor')

export class CkEditorAttribute {
    @bindable config
    @bindable({ defaultBindingMode: bindingMode.twoWay }) id
    constructor(private element) {
    }
    attached() {
        this.id = new Date().getTime().toString();
        this.element.setAttribute('id', this.id)
        var $s = require('scriptjs');
        $s('../../../assets/plugins/ckeditor/ckeditor.js', () => {
            PLATFORM.global.CKEDITOR.replace(this.element, this.config || {}).on('change', (e) => {
                this.element.value = e.editor.getData()
                this.element.dispatchEvent(new Event('change'));
            });
            PLATFORM.global.CKEDITOR.instances[this.id].on('fileUploadResponse', function (evt) {
                // Prevent the default response handler.
                evt.stop();
                var config = evt.sender.config

                // Get XHR and response.
                var data = evt.data,
                    xhr = data.fileLoader.xhr,
                    response = xhr.responseText.split('|');

                if (response[1]) {
                    // An error occurred during upload.
                    data.message = 'An error occurred during upload.!'
                    evt.cancel();
                } else {
                    data.url = config.uploadUrl.replace('upload', 'download') + '/' + JSON.parse(response[0]).result.files.upload[0].name
                }
            });

        });

    }
    detached() { }

}
