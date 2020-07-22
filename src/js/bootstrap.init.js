//====================BOOTSTRAP INIT=================//
$(document).on('show.bs.modal', '.modal', function (event) {
   var zIndex = 1040 + (10 * $('.modal:visible').length);
   $(this).css('z-index', zIndex);
   setTimeout(function () {
      $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
   }, 0);
});
$(document).ready(function () {
   $('[data-tooltip]').tooltip();
   $('.modal').on('show.bs.modal', function (e) {
      if ($('body').height() > $(window).height()) {
         $('header').css('padding-right', getScrollbarWidth());
      }
      else {
         $('body').css('padding-right', 0);
      }
      if ($(window).width() < 769) {
         var currentScrollPosition = $(window).scrollTop();
         BNS.on();
      }
   });
   $('.modal').on('shown.bs.modal', function (e) {
      if ($('body').height() > $(window).height()) {
         $('header').css('padding-right', getScrollbarWidth());
         $('body').css('padding-right', getScrollbarWidth());
      }
      // $('body').css('overflow', 'hidden');
   })
   $('.modal').on('hidden.bs.modal', function (e) {
      if (!$('.modal').hasClass('show')) {
         if ($(window).width() < 769) {
            BNS.off();
         }
         else {
            $('body').css('overflow', '');
         }
         $('body').css('padding-right', '');
         $('header').css('padding-right', '');
      }
      else {
         $('ldp-header').css('padding-right', getScrollbarWidth());
         $('body').css('padding-right', getScrollbarWidth());
      }
   });

   $(document).on('click', '.dropdown-click', function (e) {
      e.stopPropagation();
   });
   $('.dropdown-notify').on('shown.bs.dropdown', function (e) {
      $(this).removeClass('active-nofify')
   });
});
//====================END BOOTSTRAP INIT=================//