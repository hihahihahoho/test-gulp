var pluginsDetail = {
  'jquery': {
    "name": 'jquery',
    "scripts": [
      "src/plugins/jquery/jquery.min.js",
    ],
    "init": [
      "src/js/jquery.init.js"
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
      "src/plugins/lightpick/1moment.min.js",
      "src/plugins/lightpick/lightpick.js",
    ],
    "init": [
      "src/js/lightpick.init.js"
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
  }
}

var plugins = {
  'bundles': [
  ],
  'vendors': [
    pluginsDetail.pollyfill,
    pluginsDetail.momentjs,
    pluginsDetail.lightpick,
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
    pluginsDetail.wnumb
  ]
}

module.exports = {
  plugins: plugins
}