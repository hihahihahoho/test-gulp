var clipboard = new ClipboardJS('.btn');

clipboard.on('success', function (e) {
  $('#copyConsole').html(e.text)
  e.clearSelection();
});

var options = {
  valueNames: ['name', 'color', 'link']
};

var userList = new List('listWrap', options);
$('.search').on('keyup', function (event) { // Fired on 'keyup' event
  $('.list').each(function (e) {
    if ($(this).children().length === 0) { // Checking if list is empty

      $(this).parents('.search-section').addClass('hidden')

    } else {

      $(this).parents('.search-section').removeClass('hidden')

    }
  })
});

tippy('.color-label', {
  content: 'Global content',
});

mediumZoom('[data-zoomable]')

$(document).ready(function () {
  $('#search').on('input', function () {
    $(this).val(function (i, v) {
      return v.replace(/#/gi, '');
    });
  })
  $('[name=searchItem]').on('change', function () {
    if ($(this).is(':checked')) {
      var link = $(this).parents('li').find('.link').html()
      var name = $(this).parents('li').find('.name').html()
      console.log(link)
      $('.icon-info-group').addClass('hidden')
      $('.btn-link').attr('data-clipboard-text', link)
      $('.img-holder').css('background-image', 'url(' + link + ')')
      $('.file-name').html(name).attr('data-clipboard-text', name)
      if ($(this).hasClass('icon-item')) {
        $('.icon-info-group').removeClass('hidden')
      }
    }
  })
})