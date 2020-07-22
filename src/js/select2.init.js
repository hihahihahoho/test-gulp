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