//====================LIGHT GALLERY INIT=================//
var scrollTargetLp = 'section.lightpick';

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
        blockScroll(scrollTargetLp);
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
        enableScroll(scrollTargetLp);
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

[].forEach.call(document.querySelectorAll('.light-pick-range-2nd'), function (el, i, a) {
  if (i % 2 == 0 || i == 0) {
    var lpMindate = a[i].getAttribute("lpMindate") ? a[i].getAttribute("lpMindate") : null;
    var lpMaxdate = a[i].getAttribute("lpMaxdate") ? a[i].getAttribute("lpMaxdate") : null;
    var lpMaxdays = a[i].getAttribute("lpMaxdays") ? a[i].getAttribute("lpMaxdays") : null;
    var lpMindays = a[i].getAttribute("lpMindays") ? a[i].getAttribute("lpMindays") : null;
    var lpOrient = a[i].getAttribute("lpOrient") ? a[i].getAttribute("lpOrient") : 'auto';
    lprItem = new Lightpick({
      field: el,
      secondField: a[i + 1],
      repick: true,
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
        console.log($($(this)[0]._opts))
        $($(this)[0]._opts.field).addClass('light-pick-focus');
        if ($(window).width() <= 480) {
          blockScroll(scrollTargetLp);
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
          enableScroll(scrollTargetLp);
          $('.lp-backdrop').removeClass('show');
        }
      }
    });
    lpr.push(lprItem);
  }
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
        blockScroll(scrollTargetLp);
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
        enableScroll(scrollTargetLp);
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