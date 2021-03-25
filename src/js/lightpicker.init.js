
var scrollTargetLp = '.litepicker-open';
var elem = document.createElement('div');
elem.classList.add('litepicker-backdrop');
document.body.appendChild(elem);

var lp = [];
var lpr = [];

var opts = {
  format: 'DD/MM/YYYY',
  plugins: ['mobilefriendly', 'keyboardnav'],
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
  allowRepick: true
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
      if (element.name.includes('lp-')) {
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
  lpicker = new Litepicker(lpOptions).on('show', function (element) {
    this.ui.classList.add('litepicker-open');
    if (window.width < opts.mobilefriendly.breakpoint) {
      blockScroll(scrollTargetLp);
    }
  }).on('hide', function (element) {
    if (window.width < opts.mobilefriendly.breakpoint) {
      enableScroll(scrollTargetLp);
    }
    this.ui.classList.remove('litepicker-open')
    el.dispatchEvent(new Event('change', { bubbles: true }));
  })
});

[].forEach.call(document.querySelectorAll('.lite-picker-range-2nd'), function (el, i, a) {
  if (i % 2 == 0 || i == 0) {
    var lpOptions = getLightpickOption(el);
    lpOptions['elementEnd'] = a[i + 1];
    lpOptions = mergeObjects(optsRange2ndInput, lpOptions);
    lpicker = new Litepicker(lpOptions).on('show', function (element) {
      this.ui.classList.add('litepicker-open')
      if (window.width < opts.mobilefriendly.breakpoint) {
        blockScroll(scrollTargetLp);
      }
    }).on('hide', function (element) {
      if (window.width < opts.mobilefriendly.breakpoint) {
        enableScroll(scrollTargetLp);
      }
      this.ui.classList.remove('litepicker-open')
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
});