//====================TABLES=================//
$('.table-wraper-size').scroll(function (e) {
  var _this = this;
  if (_this.scrollWidth === (_this.scrollLeft + _this.clientWidth)) {
    $(_this).parent('.table-wraper-inner').addClass('right-none');
  }
  else {
    $(_this).parent('.table-wraper-inner').removeClass('right-none');
  };

  if (_this.scrollLeft === 0) {
    $(_this).parent('.table-wraper-inner').addClass('left-none');
  }
  else {
    $(_this).parent('.table-wraper-inner').removeClass('left-none');
  };
}).scroll();
//====================END TABLES=================//