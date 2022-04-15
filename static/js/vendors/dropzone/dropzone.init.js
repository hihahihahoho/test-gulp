const dropzone = new Dropzone("div.dropzone1", {
  url: "/file/post",
  autoProcessQueue: false,
  previewsContainer: '.dropzone-wrap-dropzone1 .dropzone-preview',
  dictDefaultMessage: 'Thêm ảnh',
  dictRemoveFile: '',
  addRemoveLinks: true,
  thumbnailWidth: 500,
  thumbnailHeight: 500,
  maxFiles: 3
});