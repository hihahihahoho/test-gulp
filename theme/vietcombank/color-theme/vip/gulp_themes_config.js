const _ = require('lodash');

delete require.cache[require.resolve('../../gulp_themes_config.js')];
var inheritedTheme = require('../../gulp_themes_config.js').theme

var theme = {
  color: {
    default: {
      level: {
        'primary': 'vcb-vip',
      },
      normal: {
        'vcb-vip': {
          color: '#a78656',
          text: '#ffffff',
        }
      }

    }
  }
}

_.defaultsDeep(theme, inheritedTheme)

module.exports = {
  theme: theme,
  globalScss: theme.globalScss,
  themeColor: theme.color,
  themeText: theme.text
}