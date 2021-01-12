require('es6-promise/auto')
require('whatwg-fetch')
window.Uppy = {}
Uppy.Locales.Vietnamese = require('@uppy/locales/lib/vi_VN')
Uppy.Core = require('@uppy/core')
Uppy.Tus = require('@uppy/tus')
Uppy.Dashboard = require('@uppy/dashboard')
