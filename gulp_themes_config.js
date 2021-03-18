var theme = {
  text: {
    h1: {
      'font-size': '32px',
      'line-height': '1.1',
      'font-weight' : '600',
      768: {
        'font-size': '28px',
      },
      480: {
        'font-size': '24px',
      },
    },
    h2: {
      'font-size': '24px',
      'line-height': '1.1',
      480: {
        'font-size': '22px',
      },
    },
    h3: {
      'font-size': '21px',
      'line-height': '1.1',
      480: {
        'font-size': '20px',
      },
    },
    h4: {
      'font-size': '18px',
      'line-height': '1.3',
    },
    h5: {
      'font-size': '16px',
      'line-height': '1.3',
    },
    h6: {
      'font-size': '12px',
      'line-height': '1.3',
    },
    p: {
      'font-size': '14px',
      'line-height': '1.3',
    },
  },
  color: {
    default: {
      level: {
        'primary': 'blue',
        'light-primary': 'light-blue',
        'danger': 'red',
        'light-danger': 'light-red',
        'warning': 'orange',
        'light-warning': 'light-orange',
        'success': 'green',
        'light-success': 'light-green'
      },
      normal: {
        'gradient-primary': {
          color: 'linear-gradient(-30deg,#00bfae 0,#0066ad 100%)',
          hover: 'linear-gradient(120deg,#00bfae 0,#0066ad 100%)',
          fallback: '#0093AD'
        },
        'transparent': {
          color: 'transparent',
          hover: '#f5f5f5',
          text: 'default'
        },
        'invert': {
          color: '#fff',
          hover: '#f5f5f5',
          text: 'default'
        },
        'black': {
          color: '#000'
        },
        'default': {
          color: '#121f3e'
        },
        'default-2': {
          color: '#121f31'
        },
        'blue': {
          color: '#3f3bec',
          hover: '#3935D4',
          active: '#312FBA',
          text: '#ffffff',
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
          text: '#ffffff',
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
          text: '#ffffff',
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
          text: '#ffffff',
          shadowOp: '0.3'
        },
        'light-green': {
          color: '#C2F2D6',
          hover: '#B5F2CE',
          active: '#AAF2C8',
          text: 'green'
        },
        'purple': {
          color: '#4527a0',
          text: '#ffffff',
        }
      }

    }
  }
}

module.exports = {
  theme: theme,
  themeColor: theme.color,
  themeText: theme.text
}