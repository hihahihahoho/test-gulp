const _ = require('lodash');

delete require.cache[require.resolve('../../gulp_themes_config.js')];
var inheritedTheme = require('../../gulp_themes_config.js').theme

var theme = {
  color: {
    default: {
      level: {
        'primary': 'vcb',
      },
      normal: {
        'vcb': {
          color: '#72bf00',
          text: '#ffffff',
        }
      }

    }
  }
}

_.defaultsDeep(theme, inheritedTheme)

module.exports = {
  theme: theme,
  themeColor: theme.color,
  themeText: theme.text
}