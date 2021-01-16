//====================BOOTSTRAP INIT=================//

$(document).on('show.bs.modal', '.modal', function (event) {
  var zIndex = 1040 + (10 * $('.modal:visible').length);
  $(this).css('z-index', zIndex);
  setTimeout(function () {
    $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
  }, 0);
});
$(document).ready(function () {
  $('[data-tooltip]').tooltip({
    container: 'body',
    html: true
  });
  $('[data-toast=toast]').on('click', function () {
    var id = $(this).attr('toast-target');
    $(id).toast('show')
  })
  $('.modal').on('show.bs.modal', function (e) {
    if ($(window).width() < 769) {
      var currentScrollPosition = $(window).scrollTop();
      BNS.on();
    }
  });
  $('.modal').on('hidden.bs.modal', function (e) {
    if (!$('.modal').hasClass('show')) {
      if ($(window).width() < 769) {
        BNS.off();
      }
    }
  });

  $(document).on('click', '.dropdown-click', function (e) {
    e.stopPropagation();
  });
  $('.dropdown').on('show.bs.dropdown', function () {
    $(this).parents('.table-utls').css('z-index', '2')
  }).on('hide.bs.dropdown', function () {
    $(this).parents('.table-utls').css('z-index', '')
  })
});
//====================END BOOTSTRAP INIT=================//