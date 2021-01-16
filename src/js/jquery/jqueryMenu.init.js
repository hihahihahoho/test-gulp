//====================MENU=================//
(function (name) {
  function BNS () {
    var settings = {
      prevScroll: 0,
      prevPosition: '',
      prevOverflow: '',
      prevClasses: '',
      on: false,
      classes: ''
    };

    var getPrev = function () {
      settings.prevScroll = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
      settings.prevPosition = document.body.style.position;
      settings.prevOverflow = document.body.style.overflow;
      settings.prevClasses = document.body.className;
    };

    return {
      set: function (data) {
        settings.classes = data.classes;
      },
      isOn: function () {
        return settings.on;
      },
      on: function (additionalClasses) {
        if (typeof additionalClasses === 'undefined') additionalClasses = '';

        if (settings.on) return;
        settings.on = true;

        getPrev();

        document.body.className = document.body.className + ' ' + settings.classes + ' ' + additionalClasses;
        if (iOS()) {
          if (settings.prevScroll == 0) {
            settings.prevScroll = -1
          }
          document.body.style.top = -settings.prevScroll + 'px';
          setTimeout(function () {
            document.body.style.position = 'fixed';
          }, 0); // WebKit/Blink bugfix
        }
        else {
          document.body.style.overflow = 'hidden';
        }
      },
      off: function () {
        if (!settings.on) return;
        settings.on = false;
        document.body.className = settings.prevClasses;
        if (iOS()) {
          document.body.style.top = 0;
        };
        document.body.style.position = '';
        document.body.style.overflow = settings.prevOverflow;
        window.scrollTo(0, settings.prevScroll);
      }
    };
  }

  window[name] = new BNS();
})('BNS');
+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
  }
}(jQuery);

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
        BNS.on();
        $(".menu__content").scrollTop(0);
      } else {
        BNS.off();
      }
    });
    $('.only-one [data-accordion]:not(.active)').accordion();
  };
  if ($(window).width() > menuSettings.breakpoint) {
    $('#menu-trigger').prop('checked', false);
    BNS.off();
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
    $("#sidebar-trigger").on('change', function () {
      if ($(this).is(':checked')) {
        BNS.on();
      }
      else {
        BNS.off();
      }
    });
    $("#sidebar-right-trigger").on('change', function () {
      if ($(this).is(':checked')) {
        BNS.on();
      }
      else {
        BNS.off();
      }
    })
  };
  window.addEventListener('resize', function (event) {
    menu();
  });
  menu();
});

//====================END MENU=================//