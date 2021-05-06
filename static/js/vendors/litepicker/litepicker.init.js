
var scrollTargetLp = 'body > .litepicker';
var elem = document.createElement('div');
elem.classList.add('litepicker-backdrop');
document.body.appendChild(elem);
(function () {
  if (typeof Event !== 'function') {
    window.Event = CustomEvent;
  }
})();

var today = new Date()
today = new Date().setDate(today.getDate());

var lp = [];
var lpr = [];

var titleFrom = 'Từ ngày';
var titleTo = 'Đến ngày';

var opts = {
  format: 'DD/MM/YYYY',
  plugins: ['mobilefriendly'],
  lang: 'vi-VN',
  dropdowns: {
    "minYear": 2020,
    "maxYear": 2022,
    "months": true,
    "years": true
  },
  tooltipText: {
    "one": "ngày",
    "other": "ngày"
  },
  mobilefriendly: {
    breakpoint: 480,
  },
}

var optsRange = {
  singleMode: false,
  numberOfColumns: 2,
  numberOfMonths: 2,
}

var optsRange2ndInput = {
  singleMode: false,
  numberOfColumns: 2,
  numberOfMonths: 2,
  allowRepick: true,
  minDate: today,
  maxDate: null
}

function isStartDateAddActive (start, end, className) {
  start.classList.remove(className)
  end.classList.remove(className)

  if (isStartDate) {
    start.classList.add(className)
  } else {
    end.classList.add(className)
  }
}

function GetFormattedDate (date) {

  var fullDate = date.dateInstance;
  var day = fullDate.getDate();
  var month = fullDate.getMonth() + 1;
  var year = fullDate.getFullYear();
  return day + "/" + month + "/" + year;
}
function camelCase (input) {
  return input.toLowerCase().replace(/-(.)/g, function (match, group1) {
    return group1.toUpperCase();
  });
}

function mergeObjects (obj1, obj2) {
  var obj3 = {};
  for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
  for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
  return obj3;
}

function getLightpickOption (el) {
  var attr = el.attributes;
  var overideOpts = {
    element: el,
  };
  if (el.getAttribute("lp-single-mode") == 'false') {
    overideOpts = mergeObjects(optsRange, overideOpts);
  }
  for (var key in attr) {
    var element = attr[key];
    if (typeof element === "object") {
      if (!element.name.indexOf('lp-')) {
        var name = camelCase(element.name.replace('lp-', ''))
        var val = element.value
        if (val == 'true') {
          val = true
        }
        if (val == 'false') {
          val = false
        }
        overideOpts[name] = val
      }

    }
  }
  return mergeObjects(opts, overideOpts);
}

[].forEach.call(document.querySelectorAll('.lite-picker'), function (el, i, a) {
  var lpOptions = getLightpickOption(el);
  lpicker = new Litepicker(lpOptions).on('hide', function (element) {
    el.dispatchEvent(new Event('change', { bubbles: true }))
    BNS.off()
  }).on('mobilefriendly.show', function (el) {
    BNS.on()
  }).on('render:day', function (day, date) {
    if (day.classList.contains('is-in-range') | day.classList.contains('is-start-date') | day.classList.contains('is-end-date')) {
      day.setAttribute("lpcurrent", "true")
    }
    if (day.classList.contains('is-start-date')) {
      day.setAttribute("lpstart", "true")
    }
    if (day.classList.contains('is-end-date')) {
      day.setAttribute("lpend", "true")
    }
  }).on('render', function (ui) {
    if (window.innerWidth < 481) {
      ui.querySelector('.container__months').insertAdjacentHTML("afterbegin", '<div class="litepicker-mobile-header"><button type="button" class="litepicker__close-action ">Đóng</button></div>')
      ui.querySelector('.litepicker__close-action').addEventListener('click', function () {
        lp[i].hide()
      })
    }
  });
  lp.push(lpicker)
});

var isStartDate = false;

[].forEach.call(document.querySelectorAll('.lite-picker-range-2nd'), function (el, i, a) {
  if (i % 2 == 0 || i == 0) {
    el.classList.add('lite-picker-range-2nd-start')
    var lpOptions = getLightpickOption(el);
    lpOptions['elementEnd'] = a[i + 1];
    lpOptions = mergeObjects(optsRange2ndInput, lpOptions);
    lpicker = new Litepicker(lpOptions).on('hide', function (element) {
      el.dispatchEvent(new Event('change', { bubbles: true }));
      a[i + 1].dispatchEvent(new Event('change', { bubbles: true }));
      el.classList.remove('light-pick-focus')
      a[i + 1].classList.remove('light-pick-focus')
      BNS.off()
    }).on('render:day', function (day, date) {
      // if (window.innerWidth < 481) {
      //   day.addEventListener('click', function (e) {
      //     if (isStartDate) {
      //       el.dispatchEvent(new Event('click', { bubbles: true }))
            
      //     } else {
      //       a[i + 1].dispatchEvent(new Event('click', { bubbles: true }))
      //     }
      //     e.prototype.shouldShown
      //   });
      // }
      if (day.classList.contains('is-in-range') | day.classList.contains('is-start-date') | day.classList.contains('is-end-date')) {
        day.setAttribute("lpcurrent", "true")
      }
      if (day.classList.contains('is-start-date')) {
        day.setAttribute("lpstart", "true")
      }
      if (day.classList.contains('is-end-date')) {
        day.setAttribute("lpend", "true")
      }
    }).on('before:show', function (el) {
      var getMindate;
      var getMaxdate;
      if (lpr[i / 2].getStartDate()) {
        getMindate = lpr[i / 2].getStartDate()
      } else {
        getMindate = optsRange2ndInput.minDate
      }

      if (lpr[i / 2].getEndDate()) {
        getMaxdate = lpr[i / 2].getEndDate()
      } else {
        getMaxdate = optsRange2ndInput.maxDate
      }

      if (el.classList.contains('lite-picker-range-2nd-start')) {
        isStartDate = true;
        el.classList.add('light-pick-focus');
        a[i + 1].classList.remove('light-pick-focus');
        if (optsRange2ndInput.allowRepick) {
          lpr[i / 2].setOptions({ minDate: optsRange2ndInput.minDate, maxDate: getMaxdate })
        }

      } else {
        isStartDate = false;
        el.classList.add('light-pick-focus');
        a[i].classList.remove('light-pick-focus');
        if (optsRange2ndInput.allowRepick) {
          lpr[i / 2].setOptions({ maxDate: optsRange2ndInput.maxDate, minDate: getMindate })
        }
      }
    }).on('preselect', function (date1, date2) {
      isStartDateAddActive(a[i + 1], el, 'light-pick-focus');
      if (window.innerWidth < 481) {
        if (optsRange2ndInput.allowRepick) {
          if (isStartDate) {
            lpr[i / 2].ui.classList.add('litepicker-start-date')
          } else {
            lpr[i / 2].ui.classList.remove('litepicker-start-date')
          }
          var startDateEl = lpr[i / 2].ui.querySelector('.litepicker-mobile-date-from');
          var endDateEl = lpr[i / 2].ui.querySelector('.litepicker-mobile-date-to');
          isStartDateAddActive(endDateEl, startDateEl, 'active');
        }
      }
    }).on('mobilefriendly.show', (el) => {
      BNS.on()
      if (!el.classList.contains('lite-picker-range-2nd-start')) {
        setTimeout(function () {
          lpr[i / 2].gotoDate(lpr[i / 2].getEndDate())
        }, 0)
      }
    }).on('render', function (ui) {
      if (window.innerWidth < 481) {
        var startDate = '...';
        var endDate = '...';
        if ((lpr[i / 2].getStartDate() && lpr[i / 2].getStartDate())) {
          var startDate = GetFormattedDate(lpr[i / 2].getStartDate())
          var endDate = GetFormattedDate(lpr[i / 2].getEndDate())
        }
        ui.querySelector('.container__months').insertAdjacentHTML("afterbegin", '<div class="litepicker-mobile-header"><button type="button" class="litepicker__close-action ">Đóng</button><div class="litepicker-mobile-header-content"><div class="litepicker-mobile-date litepicker-mobile-date-from"><div class="title">' + titleFrom + '</div><div class="date">' + startDate + '</div></div><div class="litepicker-mobile-date litepicker-mobile-date-to"><div class="title">' + titleTo + '</div><div class="date">' + endDate + '</div></div></div></div>')
        ui.querySelector('.litepicker__close-action').addEventListener('click', function () {
          lpr[i / 2].hide()
        })
        if (optsRange2ndInput.allowRepick) {
          if (isStartDate) {
            lpr[i / 2].ui.classList.add('litepicker-start-date')
          } else {
            lpr[i / 2].ui.classList.remove('litepicker-start-date')
          }
          var startDateEl = lpr[i / 2].ui.querySelector('.litepicker-mobile-date-from');
          var endDateEl = lpr[i / 2].ui.querySelector('.litepicker-mobile-date-to');
          isStartDateAddActive(startDateEl, endDateEl, 'active');
          startDateEl.addEventListener('click', function () {
            a[i].dispatchEvent(new Event('click', { bubbles: true }))
          });
          endDateEl.addEventListener('click', function () {
            a[i + 1].dispatchEvent(new Event('click', { bubbles: true }))
          })
        }
      }
    });
    lpr.push(lpicker)
  }
});