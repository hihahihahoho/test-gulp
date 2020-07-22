var pluginsDetail = {
  'jquery': {
    "name": 'jquery',
    "scripts": [
      "src/plugins/jquery/jquery-3.5.1.min.js",
    ]
  },
  'lightpick': {
    "name": 'lightpick',
    "scripts": [
      "src/plugins/lightpick/1moment.min.js",
      "src/plugins/lightpick/lightpick.js",
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
    ]
  }
}

var plugins = {
  'bundles': [
    pluginsDetail.bootstrap,
  ],
  'vendors': [
    pluginsDetail.jquery
  ]
}

module.exports = {
  plugins: plugins
}