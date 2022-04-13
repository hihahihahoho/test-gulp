
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
  plugins: window.innerWidth <= 480 ? ['mobilefriendly'] : '',
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
  numberOfColumns: window.innerWidth > 768 ? 2 : 1,
  numberOfMonths: window.innerWidth > 768 ? 2 : 1,
}

var optsRange2ndInput = {
  singleMode: false,
  numberOfColumns: window.innerWidth > 768 ? 2 : 1,
  numberOfMonths: window.innerWidth > 768 ? 2 : 1,
  allowRepick: true,
  minDate: today,
  maxDate: null,
  resetButton: true
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
  if (el.classList.contains('lite-picker-start')) {
    console.log('a')
    overideOpts.elementEnd = el.closest('.lite-picker-group').querySelector('.lite-picker-end');
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
        console.log(name)
        overideOpts[name] = val
      }

    }
  }
  return mergeObjects(opts, overideOpts);
}

[].forEach.call(document.querySelectorAll('.lite-picker'), function (el, i, a) {
  var lpOptions = getLightpickOption(el);
  lpicker = new Litepicker(lpOptions).on('hide', function (element) {
    el.dispatchEvent(new Event('input', { bubbles: true }))
    BNS.off();
    document.querySelector('body').classList.remove('litepicker-open')
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
    if (window.innerWidth <= opts.mobilefriendly.breakpoint) {
      var title = el.getAttribute('header-text');
      ui.querySelector('.container__months').insertAdjacentHTML("afterbegin", '<div class="litepicker-mobile-header"><div class="litepicker-mobile-header--main"><div class="row align-items-center"><div class="col"><div class="litepicker-mobile-header-title h3">' + title + '</div></div><div class="col-auto"><button type="button" class="litepicker__close-action ubg-transparent ubtn-circle-size-default ubtn-square ubg-hover ubg-active dropdown-close"><img src="media/icons-color/subdefault/default/24x24-close.svg" alt=""></button></div></div></div</div>')
      ui.querySelector('.litepicker__close-action').addEventListener('click', function () {
        lp[i].hide()
      })
    }
  });
  // autofill
  if (el.classList.contains('lite-picker-start')) {
    var elVal;
    var elValEnd;
    var elEnd = el.closest('.lite-picker-group').querySelector('.lite-picker-end');
    el.addEventListener('keyup', function () {
      elVal = el.value;
    });
    elEnd.addEventListener('keyup', function () {
      elValEnd = elEnd.value;
    })
    lpicker.on('preselect', function (date1, date2) {
      if (!date2) {
        lp[i].setDateRange(date1, date1)
      } else {
        lp[i].setDateRange(date1, date2)
      }
    }).on('hide', function (date1, date2) {
      if (elVal && !elValEnd) {
        el.value = elVal
        elEnd.value = elVal;
        lp[i].setDateRange(elVal, elVal)
      }
      if (elValEnd && !elVal) {
        el.value = elValEnd
        elEnd.value = elValEnd;
        lp[i].setDateRange(elValEnd, elValEnd)
      }
    })
  }
  // autofill
  lp.push(lpicker)
});