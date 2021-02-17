var clipboard = new ClipboardJS('.btn');

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
  $('[name=searchIconColor]').on('change', function () {
    if ($(this).is(':checked')) {
      var value = $('[name=colorPicker]:checked').val();
      var link = $(this).parents('li').find('.link').html().replace(/\/icons-color\/(.*?)\//, '/icons-color/' + value + '/');
      var name = $(this).parents('li').find('.name').html()
      $('.info-group').addClass('hidden')
      $('.icon-info-group').removeClass('hidden')
      $('.icon-info-group .btn-link').attr('data-clipboard-text', link)
      $('.icon-info-group .img-holder > img').attr('src', link)
      $('.icon-info-group .btn-html-img').attr('data-clipboard-text', '<img src="' + link + '" alt="">')
      $('.icon-info-group .btn-css-bg-img').attr('data-clipboard-text', 'background-image: url(' + link + ')')
      $('.icon-info-group .file-name').html(name).attr('data-clipboard-text', name)
    }
  });
  $('[name=colorPicker]').on('change', function () {
    var value = $(this).val();
    console.log(value)
    var btnLink = $(this).parents('.info-section').find('.btn-link');
    var imgHolderImg = $(this).parents('.info-section').find('.img-holder > img');
    var btnHtmlImg = $(this).parents('.info-section').find('.btn-html-img');
    var btnCssBgImg = $(this).parents('.info-section').find('.btn-css-bg-img');
    var link = btnLink.attr('data-clipboard-text').replace(/\/icons-color\/(.*?)\//, '/icons-color/' + value + '/');

    btnLink.attr('data-clipboard-text', link)
    btnHtmlImg.attr('data-clipboard-text', '<img src="' + link + '" alt="">')
    btnCssBgImg.attr('data-clipboard-text', 'background-image: url(' + link + ')')
    imgHolderImg.attr('src', link)
  });
  $('[name=searchColor]').on('change', function () {
    if ($(this).is(':checked')) {
      var color = $(this).parents('li').find('.color').html();
      var name = $(this).parents('li').find('.name').html();
      var colorCode = $(this).parents('li').find('.color').html();
      $('.color-info-group .file-name').html(name).attr('data-clipboard-text', name)
      $('.color-info-group .color-name').html(color).attr('data-clipboard-text', color)
      $('.color-info-group .img-holder').css('background-color', color)
      $('.info-group').addClass('hidden')
      $('.color-info-group').removeClass('hidden')
    }
  });
})