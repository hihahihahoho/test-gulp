
var scrollTargetLp = 'body > .litepicker';
var elem = document.createElement('div');
elem.classList.add('litepicker-backdrop');
document.body.appendChild(elem);
(function () {
  if (typeof Event !== 'function') {
    window.Event = CustomEvent;
  }
})();

var today = new Date();

var lpr = [];

var opts = {
  format: 'DD/MM/YYYY',
  plugins: ['mobilefriendly'],
  lang: 'vi-VN',
  dropdowns: {
    "minYear": 1990,
    "maxYear": null,
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
      if (element.name.indexOf('lp-')) {
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
    enableScroll(scrollTargetLp);
  }).on('mobilefriendly.show', function (el) {
    blockScroll(scrollTargetLp);
  })
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
      enableScroll(scrollTargetLp);
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
        el.classList.add('light-pick-focus');
        a[i + 1].classList.remove('light-pick-focus');
        isStartDate = true
        lpr[i / 2].setOptions({ minDate: optsRange2ndInput.minDate, maxDate: getMaxdate })

      } else {
        el.classList.add('light-pick-focus');
        a[i].classList.remove('light-pick-focus');
        lpr[i / 2].setOptions({ maxDate: optsRange2ndInput.maxDate, minDate: getMindate })
        isStartDate = false
      }
    }).on('preselect', function (date1, date2) {
      if (isStartDate) {
        el.classList.remove('light-pick-focus')
        a[i + 1].classList.add('light-pick-focus')
      } else {
        a[i + 1].classList.remove('light-pick-focus')
        el.classList.add('light-pick-focus')
      }
    });
    lpr.push(lpicker)
  }
});