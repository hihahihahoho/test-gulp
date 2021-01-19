var theme = {
  color: {
    default: {
      level: {
        'primary': 'blue'
      },
      normal: {
        'base': {
          color: '#121f3e'
        },
        'blue': {
          color: '#3f3bec',
          hover: '#3f3bef',
          active: '#3f3bea',
          shadowOp: '0.3'
        },
        'light-blue': {
          color: '#b3b1ff',
          text: 'blue'
        },
        'purple': {
          color: '#4527a0'
        }
      }

    }
  },
  input: {
    typeDefault: 'material-1'
  }
}

module.exports = {
  themeColor: theme.color,
  themeInput: theme.input
}