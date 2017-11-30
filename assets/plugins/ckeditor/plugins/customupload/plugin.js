CKEDITOR.plugins.add('customupload', {

  icons: 'customupload',

  init: function (editor) {
    editor.addCommand('uploadImage', new CKEDITOR.dialogCommand('uploadImageDialog'));
    editor.ui.addButton('uploadImage', {
      label: 'upload image',
      command: 'uploadImage',
      toolbar: 'insert',
      icon: this.path + 'icons/customupload.png'
    });

    CKEDITOR.dialog.add('uploadImageDialog', function (api) {
      return {
        title: 'UploadImage Dialog',
        minWidth: 400,
        minHeight: 200,
        contents: [{
            id: 'tab-basic',
            label: 'Upload image',
            elements: [{
              type: 'file',
              id: 'uploadImage',
              label: 'upload image',
              validate: CKEDITOR.dialog.validate.notEmpty("uploadImage field cannot be empty."),
              commit: function () {
                alert('commit')
              }
            }]
          }

        ],
        onShow: function () {
          var dialog = this;
          var el = dialog.getContentElement('tab-basic', 'uploadImage').getElement()
          var iframe = el.$.querySelector('iframe')
          var file = $(iframe).contents().find('input')[0]
          file.setAttribute('accept', 'image/*')
          
          var img = document.createElement('img')
          img.setAttribute('src', '')
          if (el.$.querySelector('img')) {
            el.$.replaceChild(img, el.$.querySelector('img'))
          } else {
            el.$.insertBefore(img, el.$.lastChild);
          }
          
          file.addEventListener("change", () => {
            var uploadUrl = this._.editor.config.uploadUrl
            file.setAttribute('disabled', 'disabled')
            var formData = new FormData();
            formData.append("upload", file.files[0]);
            fetch(uploadUrl, {
              method: 'POST',
              body: formData
            }).then(function (response) {
              return response.json()
            }).then(res => {
              rec = res.result.files.upload[0]
              var img = document.createElement('img')
              var url = this._.editor.config.downloadUrl + '/' + rec.name
              //console.log('this', this, dialog)
              img.setAttribute('src', url)
              img.style.height = '200px'
              img.style.width = '300px'

              if (el.$.querySelector('img')) {
                el.$.replaceChild(img, el.$.querySelector('img'))
              } else {
                el.$.insertBefore(img, el.$.lastChild);
              }

              file.removeAttribute('disabled', 'disabled')
            }).catch(err => alert(err))
          })
        },
        onOk: function () {
          var dialog = this;
          var el = dialog.getContentElement('tab-basic', 'uploadImage').getElement()
          var iframe = el.$.querySelector('iframe')
          var file = $(iframe).contents().find('input')[0]
          // var img = editor.document.createElement('img');
          var url = this._.editor.config.downloadUrl + '/' + file.files[0].name
          // img.setAttribute('src', url)
          // img.setAttribute('height', 300)
          // img.setAttribute('width', 400)
          // img.setAttribute('alt', '')
          console.log('image url ', url)
          editor.insertHtml( '<img src="' + url + '" />');  //để phối hợp với Enhanced Image
        }
      };
    });
  }
})
