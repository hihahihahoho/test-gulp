//====================BOOTSTRAP INIT=================//

var modalEls = document.querySelectorAll('.modal')
if (modalEls) {
  modalEls.forEach(el => {
    el.addEventListener('shown.bs.modal', function (event) {
      window.innerWidth < 769 ? BNS.on() : ''
    })
    el.addEventListener('hide.bs.modal', function (event) {
      window.innerWidth < 769 ? BNS.off() : ''
    })
  })
}

document.querySelectorAll('[data-toast="toast"]').forEach(el => {
  var elID = el.getAttribute('toast-target').replace('#', '');
  el.addEventListener('click', () => {
    console.log(el)
    var bsAlert = new bootstrap.Toast(document.getElementById(elID));//inizialize it
    bsAlert.show();
  })
})

const closeDropdown = document.querySelectorAll('.closeDropdown')
closeDropdown.forEach((el) => {
  el.addEventListener('click', () => {
    bootstrap.Dropdown.getInstance(el.closest('.dropdown').querySelector('[data-bs-toggle="dropdown"]')).hide()
  })
});
document.querySelectorAll('.collapse').forEach(el => {
  bootstrap.Dropdown.getInstance(el.addEventListener('show.bs.collapse', function () {
    el.closest('.accordion-item-default').classList.add('accordion-item-show')
  }))
  bootstrap.Dropdown.getInstance(el.addEventListener('hide.bs.collapse', function () {
    el.closest('.accordion-item-default').classList.remove('accordion-item-show')
  }))
})


const dropDownMobileEl = document.querySelectorAll('.dropdown-mobile')
dropDownMobileEl.forEach((el) => {
  if (deviceIsMobile) {
    let dropDownMobileElToggle = el.closest('.dropdown').querySelector('[data-bs-toggle="dropdown"]');
    dropDownMobileElToggle.addEventListener('show.bs.dropdown', function () {
      BNS.on()
    })
    dropDownMobileElToggle.addEventListener('hide.bs.dropdown', function () {
      BNS.off()
    })
  }
})

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-tooltip="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl, {
    html: true,
    popperConfig: {
      modifiers: {
        preventOverflow: {
          boundariesElement: 'viewport',
          escapeWithReference: true
        }
      },
    }
  })
})
//====================END BOOTSTRAP INIT=================//
