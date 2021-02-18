var clipboard = new ClipboardJS('[data-clipboard-text]');

clipboard.on('success', function (e) {
  $('#copyConsole').html(e.text)
  e.clearSelection();
});

var options = {
  valueNames: ['name', 'color', 'link']
};

var list1 = new List("listSearch1", options);
var list2 = new List("listSearch2", options);
var list3 = new List("listSearch3", options);

$('#search').on('keyup', function (event) { // Fired on 'keyup' event
  list1.search($(this).val());
  list2.search($(this).val());
  list3.search($(this).val());
  $('.list').each(function (e) {
    if ($(this).children().length === 0) { // Checking if list is empty

      $(this).parents('.search-section').addClass('hidden')

    } else {

      $(this).parents('.search-section').removeClass('hidden')

    }
  })
});

$('#searchClear').on('click', function() {
  $('#search').val('');
  $('#search').trigger('keyup')
})

tippy('[data-tippy-content]', {
  content: 'Global content',
});


const button = document.querySelector('[data-action="zoom"]')
const zoom = mediumZoom('[data-zoomable]')
button.addEventListener('click', () => zoom.open())

$(document).ready(function () {
  $('#search').on('input', function () {
    $(this).val(function (i, v) {
      return v.replace(/#/gi, '');
    });
  })
  $('[name=searchItem]').on('change', function () {
    $('.info-group').addClass('hidden');
    if ($(this).hasClass('searchIconColor')) {
      $('.icon-info-group').removeClass('hidden')
    }
    if ($(this).hasClass('searchColor')) {
      $('.color-info-group').removeClass('hidden');
    }
  });
  $('.copyBtn').on('change', function () {
    var nameFull = $('[name=searchItem]:checked').val();
    if ($('.searchColor:checked').val()) {
      if ($('#langCSS').is(':checked')) {
        nameFull = 'var(--' + nameFull + ')';
      }
      if ($('#langScss').is(':checked')) {
        nameFull = '$' + nameFull;
      }
      if ($('#langHTML').is(':checked')) {
        nameFull = nameFull.replace('color-', '')
      }
      if ($('#langHTML').is(':checked')) {
        value = $(this).val().replace('background-color: copyVaribles;', 'ubg-' + nameFull).replace('color: copyVaribles;', 'color-' + nameFull).replace('copyVaribles', nameFull);
      } else {
        value = $(this).val().replace('copyVaribles', nameFull);
      }
    }
    if ($('.searchIconColor:checked').val()) {
      value = $('[name=colorPicker]:checked').val();
      nameFull = nameFull.replace(/\/icons-color\/(.*?)\//, '/icons-color/' + value + '/');
      $('.icon-info-group .img-holder > img').attr('src', nameFull);
      value = $(this).val().replace('copyVaribles', nameFull);
    }
    $(this).parents('label').attr('data-clipboard-text', value).trigger('click');
  });
  $('[name="langSelect"]').on('change', function () {
    $('[name=colorBtn]:checked').trigger('change');
    if ($('#langHTML').is(':checked')) {
      $('.btn-input:not(btn-html):not(btn-css)').addClass('hidden');
      $('.btn-html').removeClass('hidden');
    } else {
      $('.btn-html').addClass('hidden');
      $('.btn-input:not(btn-html):not(btn-css)').removeClass('hidden');
    }
  });
  $('[name="colorPicker"]').on('change', function () {
    $('[name=imageBtn]:checked').trigger('change');
  })
  $('.searchColor').on('change', function () {
    var color = $(this).parents('li').find('.color').html();
    var name = $(this).parents('li').find('.name').html();
    var nameFull = $(this).parents('li').find('.name-full').html();
    $('.color-info-group .file-name').html(name).attr('data-clipboard-text', name)
    $('.color-info-group .color-name').html(color).attr('data-clipboard-text', color)
    $('.color-info-group .img-holder').css('background-color', color)
    $('[name=colorBtn]:checked').trigger('change');
  });
  $('.searchIconColor').on('change', function () {
    var value = $('[name=colorPicker]:checked').val();
    var link = $(this).parents('li').find('.link').html().replace(/\/icons-color\/(.*?)\//, '/icons-color/' + value + '/');
    var name = $(this).parents('li').find('.name').html()
    $('.icon-info-group .img-holder > img').attr('src', link)
    $('.icon-info-group .file-name').html(name).attr('data-clipboard-text', name)
    $('[name=colorPicker]:checked').trigger('change');
  });

})