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
//====================LIGHT GALLERY INIT=================//
$('.light-pick-inline-container').each(function (index) {
   $(this).attr('id', 'lpc' + index)
});
var lp = [];
var lpr = [];
[].forEach.call(document.querySelectorAll('.light-pick'), function (el, i, a) {
   var lpMindate = a[i].getAttribute("lpMindate") ? a[i].getAttribute("lpMindate") : null;
   var lpMaxdate = a[i].getAttribute("lpMaxdate") ? a[i].getAttribute("lpMaxdate") : null;
   var lpMaxdays = a[i].getAttribute("lpMaxdays") ? a[i].getAttribute("lpMaxdays") : null;
   var lpMindays = a[i].getAttribute("lpMindays") ? a[i].getAttribute("lpMindays") : null;
   var lpOrient = a[i].getAttribute("lpOrient") ? a[i].getAttribute("lpOrient") : 'auto';
   lpItem = new Lightpick({
      field: el,
      numberOfColumns: 1,
      numberOfMonths: $(window).width() > 480 ? 1 : 1,
      autoclose: true,
      minDate: a[i].getAttribute("lpMindate") ? moment().subtract(lpMindate, 'day') : null,
      maxDate: a[i].getAttribute("lpMaxdate") ? moment().add(lpMaxdate, 'day') : null,
      maxDays: lpMaxdays,
      minDays: lpMindays,
      orientation: lpOrient,
      dropdowns: {
         years: {
            min: moment().year() - 10,
            max: moment().year() + 1,
         },
         months: true,
      },
      onOpen: function () {
         $($(this)[0]._opts.field).addClass('light-pick-focus');
         console.log($(this));
         if ($(window).width() <= 480) {
            BNS.on();
            if ($($(this)[0].el).find('.lp-mobile-header').length == 0) {
               $($(this)[0].el).prepend('<div class="lp-mobile-header"><button type="button" class="lightpick__close-action">Đóng</button></div>');
            }
            $('.lp-backdrop').addClass('show');
         }
      },
      onSelect: function () {
         $($(this)[0]._opts.field).trigger('change');
      },
      onClose: function () {
         $($(this)[0]._opts.field).removeClass('light-pick-focus');
         if ($(window).width() <= 480) {
            BNS.off();
            $('.lp-backdrop').removeClass('show');
         }
      }
   });
   lp.push(lpItem);
});

[].forEach.call(document.querySelectorAll('.light-pick-inline'), function (el) {
   new Lightpick({
      field: el,
      numberOfColumns: 1,
      numberOfMonths: $(window).width() > 480 ? 1 : 1,
      autoclose: false,
      parentEl: (function () {
         var a = $(el).parent().closest('.form-group').find('.light-pick-inline-container').attr('id');
         return "#" + a

      })(),
      inline: true,
      hideOnBodyClick: false,
      dropdowns: {
         months: true,
         years: true,
      },
      onSelect: function () {
         $($(this)[0]._opts.field).trigger('change');
         var getDate = $(this)[0]._opts.startDate;
         $(this)[0].gotoDate(getDate);
      }
   })
});

[].forEach.call(document.querySelectorAll('.light-pick-range'), function (el, i, a) {
   var lpMindate = a[i].getAttribute("lpMindate") ? a[i].getAttribute("lpMindate") : null;
   var lpMaxdate = a[i].getAttribute("lpMaxdate") ? a[i].getAttribute("lpMaxdate") : null;
   var lpMaxdays = a[i].getAttribute("lpMaxdays") ? a[i].getAttribute("lpMaxdays") : null;
   var lpMindays = a[i].getAttribute("lpMindays") ? a[i].getAttribute("lpMindays") : null;
   var lpOrient = a[i].getAttribute("lpOrient") ? a[i].getAttribute("lpOrient") : 'auto';
   lprItem = new Lightpick({
      field: el,
      singleDate: false,
      numberOfColumns: 2,
      numberOfMonths: $(window).width() > 768 ? 2 : 1,
      footer: $(window).width() > 480 ? false : false,
      minDate: a[i].getAttribute("lpMindate") ? moment().subtract(lpMindate, 'day') : null,
      maxDate: a[i].getAttribute("lpMaxdate") ? moment().add(lpMaxdate, 'day') : null,
      maxDays: lpMaxdays,
      minDays: lpMindays,
      orientation: lpOrient,
      dropdowns: {
         years: {
            min: moment().year() - 10,
            max: moment().year() + 1,
         },
         months: true,
      },
      locale: {
         buttons: {
            prev: '',
            next: '',
            close: '',
            reset: 'Khôi phục',
            apply: 'Áp dụng'
         },
         tooltip: {
            one: 'ngày',
            other: 'ngày'
         },
         tooltipOnDisabled: null,
         pluralize: function (i, locale) {
            if (typeof i === "string") i = parseInt(i, 10);

            if (i === 1 && 'one' in locale) return locale.one;
            if ('other' in locale) return locale.other;

            return '';
         }
      },
      onSelect: function () {
         $($(this)[0].el).find('.lp-mobile-header-range').html($(this)[0].toString($(this)[0]._opts.format))
         $($(this)[0]._opts.field).trigger('change');
      },
      onOpen: function () {
         $($(this)[0]._opts.field).addClass('light-pick-focus');
         if ($(window).width() <= 480) {
            BNS.on();
            console.log($(this)[0])
            $($(this)[0].el).addClass('light-pick-range');
            if ($($(this)[0].el).find('.lp-mobile-header').length == 0) {
               $($(this)[0].el).prepend('<div class="lp-mobile-header"><button type="button" class="lightpick__close-action">Đóng</button><div class="lp-mobile-header-range">Từ - Đến</div></div>');
            }
            $('.lp-backdrop').addClass('show');
         }
      },
      onClose: function () {
         $($(this)[0]._opts.field).removeClass('light-pick-focus');
         if ($(window).width() <= 480) {
            BNS.off();
            $('.lp-backdrop').removeClass('show');
         }
      }
   });
   lpr.push(lprItem);
});

$(document).ready(function () {
   if ($(window).width() <= 480) {
      if ($('body').has('.light-pick')) {
         $('body').append('<button class="lp-backdrop lightpick__apply-action"></button>')
      }
   }
   else {
      $('.lightpick:not(.is-hidden)')
   }

});
//====================END LIGHT GALLERY INIT=================//
//====================ACCORDANCE INIT=================//
$(document).ready(function () {
   $('[data-content]').on('change', function () {
      $(this).closest('[data-accordion]').trigger('resize');
   })
   $('[data-accordion]').accordion({
      "transitionSpeed": 200
   });
   $('[data-accordion]').trigger('resize');
   $('.sticky-menu [data-accordion]').on('accordion.close', function () {
      setTimeout(function () {
         $(window).trigger('resize');
      }, 10)

   });
   $('.sticky-menu [data-accordion]').on('accordion.open', function () {
      setTimeout(function () {
         $(window).trigger('resize');
      }, 10)

   });

   //snap to top
   $('.accordion-snap [data-accordion]').on('accordion.close', function () {
      var el = $(this).find('[data-control]').get(0).getBoundingClientRect().y;
      if (el < 0) {
         $('html,body').animate({
            scrollTop: $(this).offset().top - 0
         }, 200);
      };
   });
});
//====================END ACCORDANCE INIT=================//
//====================SELECT2 INIT=================//

function closeSelect() {
   $('.select-2').select2('close');
}
function select2_search(term) {
   var $search = $('.select2-container--open').siblings(".select-2[multiple]").data('select2').dropdown.$search || $('.select2-container--open').siblings(".select-2[multiple]").data('select2').selection.$search;
   $search.val(term);
   $search.trigger('keyup');
}
function deselectAll() {
   if ($(".select2-results__options").children(".select2-results__message").length > 0) {
      closeSelect();
   }
   $('.select2-container--open').siblings(".select-2[multiple]").find("option").prop("selected", false);
   $('.select2-container--open').siblings(".select-2[multiple]").find("option").find('option').prop('selected', false);
   $('.select2-container--open').siblings(".select-2[multiple]").trigger("change");
   $("li.select2-results__option").attr('aria-selected', 'false');
}

$(document).ready(function () {
   $(document).on('focus', '.select2.select2-container', function (e) {
      // only open on original attempt - close focus event should not fire open
      if (e.originalEvent && $(this).find(".select2-selection--single").length > 0) {
         $(this).siblings('select:enabled').select2('open')
      }
   });
   var select2Timeout;
   if ($(window).width() <= 767) {
      if ($('body .select-2').hasClass('select-2')) {
         $('body').append('<div class="select-2-backdrop"></div>')
      }
   }
   $('.select-2-backdrop').on('click', function () {
      $('.select-2').select2('close');
   })
   $('.select-2:not([multiple])').select2({
      width: '100%',
      closeOnSelect: $(window).width() < 768 ? false : true,
   }).on("select2:opening", function () {
      if ($(window).width() <= 767) {
         BNS.off();
         clearTimeout(select2Timeout);
      }
   }).on("select2:open", function () {
      $(".select2-search--dropdown .select2-search__field").attr("placeholder", "Tìm kiếm...");
      if ($(window).width() >= 789) {
         if (navigator.userAgent.indexOf('MSIE') !== -1
            || navigator.appVersion.indexOf('Trident/') > -1) {
            $('.select2-search input').prop('focus', false);
         }
      }
      if ($(window).width() < 789) {
         $('.select2-search input').prop('focus', false);
      }
      if ($(window).width() <= 767) {
         clearTimeout(select2Timeout);
         BNS.on();
         $('.close-select').remove();
         var x = $(this).eq(0).attr('header-text');
         $('body > .select2-container .select2-dropdown').prepend('<div class="close-select"><div class="close-select__btn" href="javascript:void(0)" onclick="closeSelect()">Đóng</div>' + x + '</div>');
         $('body > .select2-container .select2-dropdown').addClass('top-0');
         $('.select-2-backdrop').addClass('show');
      }
   }).on("select2:closing", function () {
      $('.select-2-backdrop').removeClass('show');
      if ($(window).width() <= 767) {
         BNS.off();
         $('body > .select2-container .select2-dropdown').removeClass('top-0');
      }
   }).on("select2:select", function () {
      if ($(window).width() <= 767) {
         $('.select-2-backdrop').removeClass('show');
         $('body > .select2-container .select2-dropdown').removeClass('top-0');
         select2Timeout = setTimeout(function () {
            $('.select-2').select2('close');
         }, 320)
      }
   });
   $('.select-2[multiple]').select2({
      width: '100%',
      closeOnSelect: false
   }).on("select2:opening", function () {
      if ($(window).width() <= 767) {
         BNS.off();
         clearTimeout(select2Timeout);
      }
   }).on("select2:open", function () {
      $(".select2-search--dropdown .select2-search__field").attr("placeholder", "Tìm kiếm...");
      if ($(window).width() < 789) {
         $('.select2-search input').prop('focus', false);
      }
      if ($(window).width() <= 767) {
         clearTimeout(select2Timeout);
         BNS.on();
         $('.close-select').remove();
         $('.unselect-all').remove();
         $('.select2-search-container').remove();
         var x = $(this).eq(0).attr('header-text');
         // $('body > .select2-container .select2-dropdown').prepend('<div class="close-select close-select--multiple"><div class="close-select__done" href="javascript:void(0)" onclick="closeSelect()">Xong</div>' + x + '</div><span class="no-pb select2-search select2-search-container select2-search--dropdown"><input id="select-2-search-multiple" class="select2-search__field" type="search" tabindex="0" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox"><div class="unselect-all" onclick="deselectAll()">Bỏ chọn tất cả</div></span>');
         $('body > .select2-container .select2-dropdown').prepend('<div class="close-select"><div class="close-select__btn" href="javascript:void(0)" onclick="closeSelect()">Đóng</div>' + x + '</div><span class="no-pb select2-search select2-search-container select2-search--dropdown"><input placeholder="Tìm kiếm" id="select-2-search-multiple" class="select2-search__field" type="search" tabindex="0" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox"><div class="unselect-all" onclick="deselectAll()">Bỏ chọn tất cả</div></span>');
         $('body > .select2-container .select2-dropdown').addClass('top-0');
         $('.select-2-backdrop').addClass('show');
         $("#select-2-search-multiple").keyup(function () {
            console.log('a');
            select2_search($("#select-2-search-multiple").val());
         });
      }
   }).on("select2:closing", function () {
      $('.select-2-backdrop').removeClass('show');
      if ($(window).width() <= 767) {
         BNS.off();
         $('body > .select2-container .select2-dropdown').removeClass('top-0');
      }
   });
});
//====================END SELECT2 INIT=================//