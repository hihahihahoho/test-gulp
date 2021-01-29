//====================DATATABLES INIT=================//
$.fn.DataTable.ext.pager.numbers_length = 5;
$(document).ready(function () {
  $('th input[type=checkbox]').on('change', function () {
    var cells = table.cells().nodes();
    $(cells).find(':checkbox').prop('checked', $(this).is(':checked'));
  })
  var table = $('.data-table').DataTable({
    "searching": false,
    scrollX: true,
    "dom": '<"table-wraper"t><"table-footer"<"row row-10 align-items-center justify-content-md-between justify-content-center list-mv10"<"col-auto"<"row row-10 align-items-center"<"col-auto"i><"col"l>">><"col-auto"p>>><"clear">',
    "pagingType": "full_numbers",
    "language": {
      "lengthMenu": "Hiển thị: _MENU_",
      "info": "<b>_START_ - _END_</b> của <b>_TOTAL_</b>",
      "paginate": {
        "next": "",
        "last": "",
        "first": "",
        "previous": "",
      }
    },
    "initComplete": function (settings, json) {
      $('.dataTables_scrollBody').floatingScroll();
    }
  });
  // tablescroll
  $('.dataTables_scrollBody').scroll(function (e) {
    var _this = this;
    if (_this.scrollWidth === (_this.scrollLeft + _this.clientWidth)) {
      $(_this).parent('.dataTables_scroll').addClass('right-none');
    }
    else {
      $(_this).parent('.dataTables_scroll').removeClass('right-none');
    };
    if (_this.scrollLeft === 0) {
      $(_this).parent('.dataTables_scroll').addClass('left-none');
    }
    else {
      $(_this).parent('.dataTables_scroll').removeClass('left-none');
    };
  }).scroll();
  // end tablescroll
});
//====================END DATATABLES INIT=================//