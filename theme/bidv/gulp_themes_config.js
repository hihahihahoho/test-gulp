const _ = require('lodash');

delete require.cache[require.resolve('../../gulp_themes_config.js')];
var inheritedTheme = require('../../gulp_themes_config.js').theme

var theme = {
  color: {
    default: {
      level: {
        'primary': 'bidv',
      },
      normal: {
        'bidv': {
          color: '#00bfae',
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