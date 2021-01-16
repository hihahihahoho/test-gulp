//====================JQUERY INPUT=================//
$(document).ready(function () {
  //Input material
  $('.select-2.input-label-change').each(function () {
    if ($(this).val().length == 0) {
      $(this).removeClass('input-hadval');
    } else {
      $(this).addClass('input-hadval');
    }
  })
  $('.select-2.input-label-change').change(function () {
    if ($(this).val().length == 0) {
      $(this).removeClass('input-hadval');
    } else {
      $(this).addClass('input-hadval');
    }
  })
  $('.input-label-change:not(.static):not(.select-normal)').each(function () {
    if ($(this).val().length == 0) {
      $(this).removeClass('input-hadval');
    } else {
      $(this).addClass('input-hadval');
    }
    $(this).on('blur change', function () {
      if ($(this).val().length == 0) {
        $(this).removeClass('input-hadval');
      } else {
        $(this).addClass('input-hadval');
      }
    })
  });
  $('.select-normal.input-label-change').each(function () {
    if ($(this).find(':selected').length == 0) {
      $(this).removeClass('input-hadval');
    } else {
      $(this).addClass('input-hadval');
    }
    $(this).on('blur change', function () {
      if ($(this).find(':selected').length == 0) {
        $(this).removeClass('input-hadval');
      } else {
        $(this).addClass('input-hadval');
      }
    })
  });
  //End Input material
  //input clear
  $('.input-clear').on('mousedown', function () {
    var input = $(this).closest('.input-group').find('input');
    input.val('')
    input.trigger('change');
    input.keyup();
    input.focus();
  })
  $('.input-has-clear').on('paste keyup change', function () {
    var inputClear = $(this).closest('.input-group').find('.input-clear');
    if ($(this).val()) {
      inputClear.addClass('show');
    }
    else {
      inputClear.removeClass('show');
    }
  });
  //end input clear
  
  //input file upload
  $('.input-file-basic').each(function () {
    var uploadTxt = $(this).parent('.input-group').find('.file-txt')
    $(this).on('change', function (e) {
      uploadTxt.addClass('color-input')
      uploadTxt.text(e.target.files[0].name)
    })
  })
  //end input file upload
});

//====================END JQUERY INPUT=================//