var clipboard = new ClipboardJS('[data-clipboard-text]');

clipboard.on('success', function (e) {
  $('#copyConsole').html(e.text)
  e.clearSelection();
});

var options = {
  valueNames: ['name', 'color', 'link', 'name-full']
};

var listJs = [];

$('ul.list').each(function (i) {
  var id = $(this).parents('.search-section-section').attr('id');
  listJs.push(new List(id, options));
})

$('#search').on('keyup', function (event) {
  var val = $(this).val();
  $(listJs).each(function (i) {
    console.log(listJs[i])
    listJs[i].search(val);
  });
  $('.search-section').each(function () {
    if ($(this).find('.list').children().length === 0) { // Checking if list is empty
      $(this).addClass('hidden')
    } else {
      $(this).removeClass('hidden')
    }
  })
  $('.list').each(function (e) {
    if ($(this).children().length === 0) { // C`hecking if list is empty
      $(this).parents('.search-section-section').addClass('hidden')
    } else {
      $(this).parents('.search-section-section').removeClass('hidden')
    }
  })
});

function formatBytes(a,b=2){if(0===a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return parseFloat((a/Math.pow(1024,d)).toFixed(c))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}
const bytesToKb = bytes => Math.round((bytes / Math.pow(1024,1) + Number.EPSILON) * 100) / 100  + 'Kb' ;

$('#searchClear').on('click', function () {
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
    if ($(this).hasClass('searchMedia')) {
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
    if ($('.searchMedia:checked').val()) {
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
  $('.searchMedia').on('change', function () {
    var value = $('[name=colorPicker]:checked').val();
    var link = $(this).parents('li').find('.link').html().replace(/\/icons-color\/(.*?)\//, '/icons-color/' + value + '/');
    var name = $(this).parents('li').find('.name').html()
    var size = $(this).parents('li').find('.size').html();
    size = formatBytes(size);
    $('.icon-info-group .img-holder > img').attr('src', link)
    $('.icon-info-group .file-name').html(name).attr('data-clipboard-text', name);
    $('.icon-info-group .file-size').html(size).attr('data-clipboard-text', size);
    setTimeout(function () {
      var img = document.querySelector('.icon-info-group .img-holder > img');
      console.dir(img)
      $('#fileDimension').html(img.naturalWidth + ' x ' + img.naturalHeight)
      $('#fileDimension').attr('data-clipboard-text', img.naturalWidth + ' x ' + img.naturalHeight)
    }, 100)
    $('[name=colorPicker]:checked').trigger('change');
    if ($(this).hasClass('IconColor') && $(this).is(':checked')) {
      $('.color-label-wrap').removeClass('hidden')
    } else {
      $('.color-label-wrap').addClass('hidden')
    }
  });

})