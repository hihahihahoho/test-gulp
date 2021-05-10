//====================JQUERY INPUT=================//
$(document).ready(function () {
  //Input material
  $('.input-label-change:not(.static):not(select)').each(function () {
    if ($(this).val().length == 0) {
      $(this).removeClass('input-hadval');
    } else {
      $(this).addClass('input-hadval');
    }
    $(this).on('input', function () {
      if ($(this).val().length == 0) {
        $(this).removeClass('input-hadval');
      } else {
        $(this).addClass('input-hadval');
      }
    })
  });
  $('select.input-label-change:not(.static)').each(function () {
    if (!$(this).val()) {
      $(this).removeClass('input-hadval');
    } else {
      if ($(this).val().length == 0) {
        $(this).removeClass('input-hadval');
      } else {
        $(this).addClass('input-hadval');
      }
    }
    $(this).on('blur change', function () {
      if (!$(this).val()) {
        $(this).removeClass('input-hadval');
      } else {
        if ($(this).val().length == 0) {
          $(this).removeClass('input-hadval');
        } else {
          $(this).addClass('input-hadval');
        }
      }
    })
  });

  // focus
  // missing forEach on NodeList for IE11
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
  document.querySelectorAll('.newinput:not(.select-2)').forEach(function (item) {
    item.addEventListener('focus', function () {
      item.closest('.form-group').classList.add('input-focus')
    });
    item.addEventListener('blur', function () {
      item.closest('.form-group').classList.remove('input-focus')
    })
  })
  // end focus

  //End Input material
  //input clear
  $('.input-clear').on('mousedown', function () {
    var input = $(this).closest('.input-group').find('input');
    input.val('')
    input.trigger('input');
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