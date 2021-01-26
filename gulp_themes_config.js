var theme = {
  color: {
    default: {
      level: {
        'primary': 'blue',
        'light-primary': 'light-blue',
        'danger': 'blue',
        'light-danger': 'light-blue',
        'warning': 'orange',
        'light-warning': 'light-orange',
        'success': 'green',
        'light-success': 'light-green'
      },
      normal: {
        'black': {
          color: '#000'
        },
        'white': {
          color: '#fff'
        },
        'base': {
          color: '#121f3e'
        },
        'blue': {
          color: '#3f3bec',
          hover: '#3935D4',
          active: '#312FBA',
          shadowOp: '0.3'
        },
        'light-blue': {
          color: '#E5E5FF',
          hover: '#D8D8FF',
          active: '#CCCCFF',
          text: 'blue'
        },
        'red': {
          color: '#FF3D4E',
          hover: '#FFD9DA',
          active: '#CC313E',
          shadowOp: '0.3'
        },
        'light-red': {
          color: '#FFE6E8',
          hover: '#D8D8FF',
          active: '#FFCCD2',
          text: 'red'
        },
        'orange': {
          color: '#FF7544',
          hover: '#F26F41',
          active: '#E6693D',
          shadowOp: '0.3'
        },
        'light-orange': {
          color: '#FFE3D9',
          hover: '#FFD9CC',
          active: '#FFD0BF',
          text: 'orange'
        },
        'green': {
          color: '#2ED573',
          hover: '#2CCC6E',
          active: '#29BD66',
          shadowOp: '0.3'
        },
        'light-green': {
          color: '#C2F2D6',
          hover: '#B5F2CE',
          active: '#AAF2C8',
          text: 'green'
        },
        'purple': {
          color: '#4527a0'
        }
      }

    }
  }
}

module.exports = {
  themeColor: theme.color,
  themeInput: theme.input
}