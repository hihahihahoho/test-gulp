$(document).ready(function () {
  $('.input-file-basic').each(function () {
    var uploadTxt = $(this).parent('.input-group').find('.file-txt')
    $(this).on('change', function (e) {
      uploadTxt.addClass('color-input')
      uploadTxt.text(e.target.files[0].name)
    })
  })
})