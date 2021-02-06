var clipboard = new ClipboardJS('.btn');

clipboard.on('success', function (e) {
  $('#copyConsole').html(e.text)
  e.clearSelection();
});

var options = {
  valueNames: ['name', 'color']
};

var userList = new List('listWrap', options);
$(document).ready(function () {
  $('#search').on('input', function () {
    $(this).val(function (i, v) {
      return v.replace(/#/gi, '');
    });
  })
})