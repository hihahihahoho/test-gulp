// Block body scroll overlay
(function (name) {
  function BNS () {
    var settings = {
      prevScroll: 0,
      prevPosition: '',
      prevOverflow: '',
      prevClasses: '',
      on: false,
      classes: ''
    };

    var getPrev = function () {
      settings.prevScroll = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
      settings.prevPosition = document.body.style.position;
      settings.prevOverflow = document.body.style.overflow;
      settings.prevClasses = document.body.className;
    };

    return {
      set: function (data) {
        settings.classes = data.classes;
      },
      isOn: function () {
        return settings.on;
      },
      on: function (additionalClasses) {
        if (typeof additionalClasses === 'undefined') additionalClasses = '';

        if (settings.on) return;
        settings.on = true;

        getPrev();

        document.body.className = document.body.className + ' ' + settings.classes + ' ' + additionalClasses;
        if (iOS()) {
          if (settings.prevScroll == 0) {
            settings.prevScroll = -1
          }
          document.body.style.top = -settings.prevScroll + 'px';
          setTimeout(function () {
            document.body.style.position = 'fixed';
          }, 0); // WebKit/Blink bugfix
        }
        document.body.style.overflow = 'hidden';
      },
      off: function () {
        if (!settings.on) return;
        settings.on = false;
        document.body.className = settings.prevClasses;
        if (iOS()) {
          document.body.style.top = 0;
        };
        document.body.style.position = '';
        document.body.style.overflow = settings.prevOverflow;
        window.scrollTo(0, settings.prevScroll);
      }
    };
  }

  window[name] = new BNS();
})('BNS');
// Block body scroll overlay