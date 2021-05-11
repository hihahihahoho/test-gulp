var pluginsDetail = {
  'jquery': {
    "name": 'jquery',
    "scripts": [
      "src/plugins/jquery/jquery.min.js",
    ],
    "init": [
      "src/js/jquery/jqueryBNS.init.js",
      "src/js/jquery/jqueryBasic.init.js",
      "src/js/jquery/jqueryMenu.init.js",
      "src/js/jquery/jqueryInput.init.js",
      "src/js/jquery/jqueryTable.init.js",
      "src/js/jquery/otp.js"
    ]
  },
  'parsley': {
    "name": 'parsley',
    "scripts": [
      "node_modules/parsleyjs/dist/parsley.min.js",
    ],
    "init": [
      "src/js/parsley-init.js",
    ]
  },
  'pollyfill': {
    "name": 'pollyfill',
    "scripts": [
      "src/plugins/pollyfill/lightpick-polyfill.min.js",
    ]
  },
  'momentjs': {
    "name": 'momentjs',
    "scripts": [
      "src/plugins/momentjs/moment.min.js",
    ]
  },
  'lightpick': {
    "name": 'lightpick',
    "scripts": [
      "src/plugins/lightpick/lightpick.js",
    ],
    "init": [
      "src/js/lightpick.init.js"
    ]
  },
  'litepicker': {
    "name": 'litepicker',
    "scripts": [
      "node_modules/litepicker/dist/nocss/litepicker.js",
      "node_modules/litepicker/dist/plugins/mobilefriendly.js"
    ],
    "init": [
      "src/js/litepicker.init.js"
    ]
  },
  'ie11polyfills': {
    "name": 'ie11polyfills',
    "scripts": [
      "src/plugins/litepicker/polyfills-ie11.min.js",
      "node_modules/custom-event-polyfill/polyfill.js"
    ]
  },
  'select2': {
    "name": 'select2',
    "styles": [
      "src/plugins/select2/select2.min.css"
    ],
    "scripts": [
      "src/plugins/select2/select2.min.js"
    ],
    "init": [
      "src/js/select2.init.js"
    ]
  },
  'jqueryAccordion': {
    "name": 'jquery-accordion',
    "scripts": [
      "src/plugins/jquery-accordion/jquery.accordion.js"
    ],
    "init": [
      "src/js/jquery-accordion.init.js"
    ]
  },
  'bootstrap': {
    "name": 'bootstrap',
    "styles": [
      "node_modules/bootstrap/dist/css/bootstrap.min.css"
    ],
    "scripts": [
      "node_modules/bootstrap/js/dist/util.js",
      "node_modules/bootstrap/js/dist/modal.js",
      "node_modules/bootstrap/js/dist/dropdown.js",
      "node_modules/bootstrap/js/dist/tooltip.js",
      "node_modules/bootstrap/js/dist/popover.js",
      "node_modules/bootstrap/js/dist/tab.js",
      "node_modules/bootstrap/js/dist/toast.js"
    ],
    "init": [
      "src/js/bootstrap.init.js"
    ]
  },
  'swiper': {
    "name": 'swiper',
    "styles": [
      "src/plugins/swiper/swiper.min.css"
    ],
    "scripts": [
      "src/plugins/swiper/swiper.min.js"
    ]
  },
  'popper': {
    "name": 'popper',
    "scripts": [
      "src/plugins/popper/popper.min.js"
    ]
  },
  'cleave': {
    "name": 'cleave',
    "scripts": [
      "node_modules/cleave.js/dist/cleave.min.js"
    ],
    "init": [
      "src/js/cleave.init.js"
    ]
  },
  'sortablejs': {
    "name": 'sortablejs',
    "scripts": [
      "node_modules/sortablejs/dist/sortable.umd.js"
    ]
  },
  'autosize': {
    "name": 'autosize',
    "scripts": [
      "src/plugins/autosize/autosize.min.js"
    ],
    "init": [
      "src/js/autosize.init.js"
    ]
  },
  'croppie': {
    "name": 'croppie',
    "styles": [
      "node_modules/croppie/croppie.css"   
    ],
    "scripts": [
      "node_modules/croppie/croppie.min.js"
    ],
    "init": [
      "src/js/croppie.init.js"
    ]
  },
  'uppy': {
    "name": 'uppy',
    "styles": [
      "node_modules/@uppy/core/dist/style.min.css",
      "node_modules/@uppy/dashboard/dist/style.min.css"
    ],
    "scripts": [
      "./src/plugins-browserify/uppy/uppy.js"
    ],
    "init": [
      "src/js/uppy.init.js"
    ]
  },
  'nouislider': {
    "name": 'nouislider',
    "styles": [
      "node_modules/nouislider/distribute/nouislider.min.css"
    ],
    "scripts": [
      "node_modules/nouislider/distribute/nouislider.min.js"
    ],
    "init": [
      "src/js/nouislider.init.js"
    ]
  },
  'wnumb': {
    "name": 'wnumb',
    "scripts": [
      "node_modules/wnumb/wNumb.min.js"
    ]
  },
  'datatables': {
    "name": 'datatables',
    "styles": [
      "node_modules/datatables.net-dt/css/jquery.dataTables.min.css",
      "node_modules/datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css"
    ],
    "scripts": [
      "node_modules/datatables.net/js/jquery.dataTables.min.js",
      "node_modules/datatables.net-responsive/js/dataTables.responsive.min.js",
      "node_modules/datatables.net-responsive-bs4/js/responsive.bootstrap4.min.js"
    ],
    "init": [
      "src/js/datatables.init.js"
    ]
  },
  'floatingScroll': {
    "name": 'floatingScroll',
    "styles": [
      "node_modules/floating-scroll/dist/jquery.floatingscroll.css"
    ],
    "scripts": [
      "node_modules/floating-scroll/dist/jquery.floatingscroll.min.js"
    ],
    "init": [
      "src/js/floaingScroll.init.js"
    ]
  },
  'bodyScrollLock': {
    "name": 'bodyScrollLock',
    "scripts": [
      "node_modules/body-scroll-lock/lib/bodyScrollLock.min.js"
    ],
    "init": [
      "src/js/bodyScrollLock.init.js"
    ]
  },
  'iosInnerHeight': {
    "name": 'iosInnerHeight',
    "scripts": [
      "node_modules/ios-inner-height/dist/ios-inner-height.min.js"
    ],
    "init": [
      "src/js/iosInnerHeight.init.js"
    ]
  },
}

var plugins = {
  'bundles': [
  ],
  'vendors': [
    pluginsDetail.pollyfill,
    pluginsDetail.momentjs,
    pluginsDetail.lightpick,
    pluginsDetail.ie11polyfills,
    pluginsDetail.litepicker,
    pluginsDetail.jquery,
    pluginsDetail.popper,
    pluginsDetail.bootstrap,
    pluginsDetail.jqueryAccordion,
    pluginsDetail.select2,
    pluginsDetail.parsley,
    pluginsDetail.swiper,
    pluginsDetail.cleave,
    pluginsDetail.sortablejs,
    pluginsDetail.autosize,
    pluginsDetail.croppie,
    pluginsDetail.uppy,
    pluginsDetail.nouislider,
    pluginsDetail.wnumb,
    pluginsDetail.datatables,
    pluginsDetail.floatingScroll,
    pluginsDetail.iosInnerHeight
  ]
}

module.exports = {
  plugins: plugins
}