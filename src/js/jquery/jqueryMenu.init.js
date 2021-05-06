//====================MENU=================//
var menuSettings = {
  breakpoint: 1200, //breakpoint of menu
  iscrollMenuEnable: false, //Enable iscroll for menu;
  itemsAnimationDelay: 50,//Item tranision ios
  menuChange: true,
}
$.fn.isolatedScroll = function () {
  this.bind('mousewheel DOMMouseScroll', function (e) {
    var delta = e.wheelDelta || (e.originalEvent && e.originalEvent.wheelDelta) || -e.detail,
      bottomOverflow = this.scrollTop + $(this).outerHeight() - this.scrollHeight >= 0,
      topOverflow = this.scrollTop <= 0;

    if ((delta < 0 && bottomOverflow) || (delta > 0 && topOverflow)) {
      e.preventDefault();
    }
  });
  return this;
};

function menu () {
  var closedCSS = { 'max-height': 0, 'overflow': 'hidden' };
  if ((deviceIsMobile) || ($(window).width() <= menuSettings.breakpoint)) {
    $("#menu-trigger").on('change', function () {
      if ((this.checked) && (menuSettings.iscrollMenuEnable == false)) {
        var scrollTargetHeader = 'header.menu';
        BNS.on()
        $(".menu__content").scrollTop(0);
      } else {
        BNS.off()
      }
    });
    $('.only-one [data-accordion]:not(.active)').accordion();
  };
  if ($(window).width() > menuSettings.breakpoint) {
    $('#menu-trigger').prop('checked', false);
    BNS.off()
  };
};

(function ($) {
  $.fn.isActive = function () {
    return $(this.get(0)).hasClass('open')
  }
})(jQuery);

$(document).ready(function () {
  $('.isolated-scroll').isolatedScroll();
  if ($(window).width() <= menuSettings.breakpoint) {
    var scrollTargetText = '.sidebar';
    $("#sidebar-trigger").on('change', function () {
      if ($(this).is(':checked')) {
        BNS.on()
      }
      else {
        BNS.off()
      }
    });
    $("#sidebar-right-trigger").on('change', function () {
      if ($(this).is(':checked')) {
        BNS.on()
      }
      else {
        BNS.off()
      }
    })
  };
  window.addEventListener('resize', function (event) {
    menu();
  });
  menu();
});

//====================END MENU=================//