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
  $('.searchIconColor').on('change', function () {
    if ($(this).is(':checked')) {
      var value = $('[name=colorPicker]:checked').val();
      var link = $(this).parents('li').find('.link').html().replace(/\/icons-color\/(.*?)\//, '/icons-color/' + value + '/');
      var name = $(this).parents('li').find('.name').html()
      $('.info-group').addClass('hidden');
      $('.icon-info-group').removeClass('hidden');
      $('.icon-info-group .btn-link').attr('data-clipboard-text', link);
      $('.icon-info-group .img-holder > img').attr('src', link)
      $('.icon-info-group .btn-html-img').attr('data-clipboard-text', '<img src="' + link + '" alt="">')
      $('.icon-info-group .btn-css-bg-img').attr('data-clipboard-text', 'background-image: url(' + link + ')')
      $('.icon-info-group .file-name').html(name).attr('data-clipboard-text', name)
    }
  });
  $('.searchIconColor').parents('li').on('click', function () {
    setTimeout(function () {
      $('.icon-info-group .btn-link').trigger('click');
    }, 100)
  });
  $('[name=colorPicker]').on('change', function () {
    $('.searchIconColor').trigger('change')
  });
  $('.icon-info-group .btn-group .btn').on('click', function () {
    var copyVal = $(this).attr('data-clipboard-text');
    $('[name=colorPicker]').parents('label').each(function () {
      var value = $(this).find('input').val();
      copyVal = copyVal.replace(/\/icons-color\/(.*?)\//, '/icons-color/' + value + '/');
      $(this).attr('data-clipboard-text', copyVal)
    })
  });
  $('.color-info-group .btn-group .btn').each(function () {
    $(this).attr('data-clipboard-text-original', $(this).attr('data-clipboard-text'))
  });
  $('.searchColor').on('change', function () {
    if ($(this).is(':checked')) {
      var color = $(this).parents('li').find('.color').html();
      var name = $(this).parents('li').find('.name').html();
      var nameFull = $(this).parents('li').find('.name-full').html();
      nameFull.includes('')
      var colorCode = $(this).parents('li').find('.color').html();
      $('.color-info-group .file-name').html(name).attr('data-clipboard-text', name)
      $('.color-info-group .color-name').html(color).attr('data-clipboard-text', color)
      $('.color-info-group .img-holder').css('background-color', color)
      $('.info-group').addClass('hidden')
      $('.color-info-group').removeClass('hidden');
      $('#langCSS').val('var(--' + nameFull + ')');
      $('#langScss').val('$' + nameFull);
      $('#langHTML').val(nameFull);
      if ($('#langHTML').is(':checked')) {
        nameFull = nameFull.replace('color-', '')
        $('.color-info-group .btn-group .btn:not(.btn-html)').addClass('hidden');
        $('.color-info-group .btn-group .btn-html:not(.btn-css)').removeClass('hidden')
      }
      else {
        $('.color-info-group .btn-group .btn-html:not(.btn-css)').addClass('hidden');
        $('.color-info-group .btn-group .btn:not(.btn-html)').removeClass('hidden');
      }
      if ($('#langCSS').is(':checked')) {
        nameFull = 'var(--' + nameFull + ')';
      }
      if ($('#langScss').is(':checked')) {
        nameFull = '$' + nameFull;
      }
      $('.color-info-group .btn-group .btn').each(function () {
        $(this).attr('data-clipboard-text', $(this).attr('data-clipboard-text-original').replace('colorVaribles', nameFull));
        if ($('#langHTML').is(':checked')) {
          nameFullHtml = $(this).attr('data-clipboard-text-original').replace('background-color: colorVaribles;', 'ubg-' + nameFull).replace('color: colorVaribles;', 'color-' + nameFull).replace('colorVaribles', nameFull);
          $(this).attr('data-clipboard-text', nameFullHtml);
        }
      })
    }
  });
  $('.color-info-group .btn-group .btn').on('click', function () {
    var copyVal = $(this).attr('data-clipboard-text-original');
    $('[name=langSelect]').parents('label').each(function () {
      var value = $(this).find('input').val();
      console.log(copyVal)
      copyValNew = copyVal.replace('colorVaribles', value);
      $(this).attr('data-clipboard-text', copyValNew)
    });
  });
  $('[name=langSelect]').on('change', function () {
    $('.searchColor').trigger('change')
  });
  $('.searchColor').parents('li').on('click', function () {
    setTimeout(function () {
      if ($('#langHTML').is(':checked')) {
      }
      else {
       $('.color-info-group .btn-var').trigger('click');
      }
    }, 100)
  });
})