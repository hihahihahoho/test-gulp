// The DOM element you wish to replace with Tagify
var input = document.querySelectorAll('input.input-tagify');

function validateRemove (el) {
  console.log('a')
  if (!el.closest('.input-inner-wrap').querySelector('[aria-invalid="true"]')) {
    el.closest('.input-inner-wrap').querySelector('input').classList.remove('parsley-error')
    el.closest('.form-group').querySelector('.errorBlock').innerHTML = ``
  }
}

// initialize Tagify on the above input node reference
input.forEach(el => {
  new Tagify(el, {
    pattern: /\S+@\S+\.\S+/,
    keepInvalidTags: true,
    texts: {
      pattern: "Không đúng định dạng, vui lòng kiểm tra lại",
      duplicate: "Trùng",
    },
    callbacks: {
      "change": (e) => {
        e.detail.tagify.DOM.originalInput.closest('.input-inner-wrap').querySelector('input').classList.add('input-hadval')
      },
      "invalid": (e) => {
        e.detail.tagify.DOM.originalInput.closest('.input-inner-wrap').querySelector('input').classList.add('parsley-error')
        e.detail.tagify.DOM.originalInput.closest('.form-group').querySelector('.errorBlock').innerHTML = `<div>${e.detail.message}</div>`
      }, "click": (e) => {
        validateRemove(e.detail.tagify.DOM.originalInput)
      }, "remove": (e) => {
        console.log(e)
        validateRemove(e.detail.tagify.DOM.originalInput)
      }, "blur": (e) => {
        validateRemove(e.detail.tagify.DOM.originalInput)
      }
    }
  })
})
