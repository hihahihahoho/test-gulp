var pluginsDetail = {
  'lightpick': {
    "scripts": [
      "src/plugins/bundles/lightpick/1moment.min.js",
      "src/plugins/bundles/lightpick/lightpick.js",
    ]
  },
  'bootstrap': {
    "styles": [
      "node_modules/bootstrap/dist/css/bootstrap.min.css"
    ],
    "scripts": [
      "node_modules/bootstrap/js/dist/util.js",
      "node_modules/bootstrap/js/dist/modal.js",
      "node_modules/bootstrap/js/dist/dropdown.js",
      "node_modules/bootstrap/js/dist/popover.js",
      "node_modules/bootstrap/js/dist/tooltip.js",
      "node_modules/bootstrap/js/dist/tab.js",
    ]
  }
}

var plugins = {
  'bundles': [
    pluginsDetail.bootstrap,
    pluginsDetail.lightpick,
  ]
}

module.exports = {
  plugins: plugins
}