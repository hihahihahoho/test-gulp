var pluginsDetail = {
  'jquery': {
    "name": 'jquery',
    "scripts": [
      "src/plugins/jquery/jquery.min.js",
    ],
    "init": [
      "src/js/jquery.init.js",
      "src/js/jquery-live-search.init.js"
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
      "node_modules/select2/dist/js/i18n/vi.js",
      "node_modules/select2/dist/js/select2.min.js"
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
    ],
    "init": [
      "src/js/bootstrap.init.js"
    ]
  }
}

var plugins = {
  'bundles': [
    pluginsDetail.bootstrap,
    pluginsDetail.lightpick,
    pluginsDetail.jqueryAccordion,
    pluginsDetail.select2
  ],
  'vendors': [
    pluginsDetail.jquery,
  ]
}

module.exports = {
  plugins: plugins
}