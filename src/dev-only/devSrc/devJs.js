// function from https://stackoverflow.com/a/5624139/3695983
function hexToRgb (hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')


// function from https://stackoverflow.com/a/9733420/3695983                     
function luminance (r, g, b) {
  var a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function calculateRatio (foreground, background) {

  // read the colors and transform them into rgb format
  const color1 = foreground;
  const color2 = background;
  const color1rgb = hexToRgb(color1);
  const color2rgb = hexToRgb(color2);

  // calculate the relative luminance
  const color1luminance = luminance(color1rgb.r, color1rgb.g, color1rgb.b);
  const color2luminance = luminance(color2rgb.r, color2rgb.g, color2rgb.b);

  // calculate the color contrast ratio
  const ratio = color1luminance > color2luminance
    ? ((color2luminance + 0.05) / (color1luminance + 0.05))
    : ((color1luminance + 0.05) / (color2luminance + 0.05));

  return ratio < 1 / 1.8 ? true : false;
}


var clipboard = new ClipboardJS('[data-clipboard-text]');
const colorThief = new ColorThief();

window.addEventListener("load", event => {
  var image = document.querySelector('img');
  var isLoaded = image.complete && image.naturalHeight !== 0;
  var imgs = document.querySelectorAll('.ic-wrap img')
  imgs.forEach(function (img) {
    if (colorThief.getColor(img)) {
      var color = rgbToHex(colorThief.getColor(img)[0], colorThief.getColor(img)[1], colorThief.getColor(img)[2])
      if (!calculateRatio(color, '#ffffff')) {
        img.closest('.ic-wrap').style.backgroundColor = '#121f3E'
      }
      else {
        img.closest('.ic-wrap').style.backgroundColor = ''
      }
    }
  })

});

clipboard.on('success', function (e) {
  $('#copyConsole').html(e.text)
  e.clearSelection();
});

var options = {
  valueNames: ['name', 'color', 'link', 'name-full', 'size']
};

var listJs = [];

$('ul.list').each(function (i) {
  var id = $(this).parents('.search-section-section').attr('id');
  listJs.push(new List(id, options));
})
$('#search').on('keyup', function (event) {
  var val = $(this).val();
  $(listJs).each(function (i) {
    console.log(listJs[i])
    listJs[i].search(val);
  });
  $('.search-section').each(function () {
    if ($(this).find('.list').children().length === 0) { // Checking if list is empty
      $(this).addClass('hidden')
    } else {
      if ($(this).attr('id') == $('[name="asset"]:checked').val()) {
        $(this).removeClass('hidden');
      }
      if ($('[name="asset"]:checked').val() == 'sectionAll') {
        $(this).removeClass('hidden');
      }
    }
  })
  $('.list').each(function (e) {
    if ($(this).children().length === 0) { // C`hecking if list is empty
      $(this).parents('.search-section-section').addClass('hidden')
    } else {
      $(this).parents('.search-section-section').removeClass('hidden')
    }
  })
});

function formatBytes (a, b = 2) { if (0 === a) return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024)); return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d] }
const bytesToKb = bytes => Math.round((bytes / Math.pow(1024, 1) + Number.EPSILON) * 100) / 100 + 'Kb';

$('#searchClear').on('click', function () {
  $('#search').val('');
  $('#search').trigger('keyup')
})

tippy('[data-tippy-content]', {
  content: 'Global content',
});

const convertImages = (query, callback) => {
  const images = document.querySelectorAll(query);

  images.forEach(image => {
    fetch(image.src)
      .then(res => res.text())
      .then(data => {
        const parser = new DOMParser();
        const svg = parser.parseFromString(data, 'image/svg+xml').querySelector('svg');

        if (image.id) svg.id = image.id;
        if (image.className) svg.classList = image.classList;

        image.parentNode.replaceChild(svg, image);
      })
      .then(callback)
      .catch(error => console.error(error))
  });
}

const button = document.querySelector('[data-action="zoom"]')
const zoom = mediumZoom('[data-zoomable]')
button.addEventListener('click', () => zoom.open())

$(document).ready(function () {
  $('[name="asset"]').on("change", function () {
    if ($(this).val() == "sectionAll") {
      $('.search-section').removeClass('hidden');
    } else {
      $('.search-section').addClass('hidden');
      $('#' + $(this).val()).removeClass('hidden');
    }
  });
  $('#search').on('input', function () {
    $(this).val(function (i, v) {
      return v.replace(/#/gi, '');
    });
  })
  $('[name=searchItem]').on('change', function () {
    $('.info-group').addClass('hidden');
    if ($(this).hasClass('searchMedia')) {
      $('.icon-info-group').removeClass('hidden')
    }
    if ($(this).hasClass('searchColor')) {
      $('.color-info-group').removeClass('hidden');
    }
    if ($(this).hasClass('searchText')) {
      $('.text-info-group').removeClass('hidden');
    }
  });
  var getColor;
  $('.copyBtn').on('change', function () {
    clearTimeout(getColor);
    var langCSS = $(this).parents('.info-group').find('.langCSS');
    var langScss = $(this).parents('.info-group').find('.langScss');
    var langHTML = $(this).parents('.info-group').find('.langHTML');
    var nameFull = $('[name=searchItem]:checked').val();
    if ($('.searchColor:checked').val() || $('.searchText:checked').val()) {
      if ($(langCSS).is(':checked')) {
        nameFull = 'var(--' + nameFull + ')';
      }
      if ($(langScss).is(':checked')) {
        nameFull = '$' + nameFull;
      }
      if ($(langHTML).is(':checked')) {
        nameFull = nameFull.replace('color-', '')
      }
      if ($(langHTML).is(':checked')) {
        value = $(this).val().replace('background-color: copyVaribles;', 'ubg-' + nameFull).replace('color: copyVaribles;', 'color-' + nameFull).replace('font-size: copyVaribles;', nameFull).replace('copyVaribles', nameFull);
      } else {
        value = $(this).val().replace('copyVaribles', nameFull);
      }
    }
    if ($('.searchMedia:checked').val()) {
      value = $('[name=colorPicker]:checked').val();
      nameFull = nameFull.replace(/\/icons-color\/(.*?)\//, '/icons-color/' + value + '/');
      $('.icon-info-group .img-holder > img').attr('src', nameFull);
      getColor = setTimeout(function () {
        var img = document.querySelector('.icon-info-group .img-holder > img')
        if (colorThief.getColor(img)) {
          var color = rgbToHex(colorThief.getColor(img)[0], colorThief.getColor(img)[1], colorThief.getColor(img)[2])
          if (!calculateRatio(color, '#ffffff')) {
            console.log('true')
            $('.icon-info-group .img-holder').css('background-color', '#121f3E')
          }
          else {
            $('.icon-info-group .img-holder').css('background-color', '')
          }
        }
      }, 100)
      value = $(this).val().replace('copyVaribles', nameFull);

    }
    $('[name=searchItem]:checked').parents('.ic-wrap-label').attr('data-clipboard-text', value);
    $(this).parents('label').attr('data-clipboard-text', value).trigger('click');
  });
  $('.langSelect').on('change', function () {
    var langHTML = $(this).parents('.info-group').find('.langHTML');
    $(this).parents('.info-group').find('.copyBtn:checked').trigger('change');
    if ($(langHTML).is(':checked')) {
      $(this).parents('.info-group').find('.btn-input:not(btn-html):not(btn-css)').addClass('hidden');
      $(this).parents('.info-group').find('.btn-html').removeClass('hidden');
    } else {
      $(this).parents('.info-group').find('.btn-html').addClass('hidden');
      $(this).parents('.info-group').find('.btn-input:not(btn-html):not(btn-css)').removeClass('hidden');
    }
  });
  $('[name="colorPicker"]').on('change', function () {
    $('[name=imageBtn]:checked').trigger('change');
  });

  $('.searchColor').on('change', function () {
    var color = $(this).parents('li').find('.color').html();
    var name = $(this).parents('li').find('.name').html();
    var nameFull = $(this).parents('li').find('.name-full').html();
    $('.color-info-group .file-name').html(name).attr('data-clipboard-text', name)
    $('.color-info-group .weight-name').html(color).attr('data-clipboard-text', color)
    $('.color-info-group .img-holder').css('background-color', color)
    $('[name=colorBtn]:checked').trigger('change');
  });

  $('.searchText').on('change', function () {
    var size = $(this).parents('li').find('.size').html();
    var name = $(this).parents('li').find('.name').html();
    var weight = $(this).parents('li').find('.weight').html();
    var lineHeight = $(this).parents('li').find('.line-height').html();
    $('.text-info-group .img-holder').html(name).css('font-size', size).css('font-weight', weight);
    $('.text-info-group .font-size-name').html('font-size: ' + size).attr('data-clipboard-text', 'font-size: ' + size);
    $('.text-info-group .weight-name').html('font-weight: ' + weight).attr('data-clipboard-text', 'font-weight: ' + weight)
    $('.text-info-group .line-height-name').html('line-height: ' + lineHeight).attr('data-clipboard-text', 'line-height: ' + lineHeight)
    $('[name=textBtn]:checked').trigger('change');
  });

  $('.searchMedia').on('change', function () {
    var value = $('[name=colorPicker]:checked').val();
    var link = $(this).parents('li').find('.link').html().replace(/\/icons-color\/(.*?)\//, '/icons-color/' + value + '/');
    var name = $(this).parents('li').find('.name').html()
    var size = $(this).parents('li').find('.size').html();
    size = formatBytes(size);
    $('.icon-info-group .img-holder > img').attr('src', link);
    $('.icon-info-group .file-name').html(name).attr('data-clipboard-text', name);
    $('.icon-info-group .file-size').html(size).attr('data-clipboard-text', size);
    setTimeout(function () {
      var img = document.querySelector('.icon-info-group .img-holder > img');
      $('#fileDimension').html(img.naturalWidth + ' x ' + img.naturalHeight)
      $('#fileDimension').attr('data-clipboard-text', img.naturalWidth + ' x ' + img.naturalHeight);
    }, 100)
    $('[name=colorPicker]:checked').trigger('change');
    if ($(this).hasClass('IconColor') && $(this).is(':checked')) {
      $('.color-label-wrap').removeClass('hidden')
    } else {
      $('.color-label-wrap').addClass('hidden')
    }
  });

})