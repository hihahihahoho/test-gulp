function hammerSelect2 (el) {
  var select2El = document.querySelector('.select2-dropdown');
  var select2Con = document.querySelector('.select2-dropdown');
  var select2Scroll = document.querySelector('.select2-dropdown .select2-results__options');

  var panStartDown = false;

  var hammerSelect2 = new Hammer(select2El, {
    direction: Hammer.DIRECTION_ALL,
    threshold: 10,
    inputClass: Hammer.TouchInput,
    // touchAction: 'auto',
  });
  hammerSelect2.get('pan').set({ direction: Hammer.DIRECTION_ALL });
  hammerSelect2.on('panstart', (ev) => {
    console.log(ev.additionalEvent)
    panStartDown = ev.additionalEvent == 'pandown' ? true : false
  })
  hammerSelect2.on('pan', (ev) => {
    if (panStartDown) {
      if (select2Scroll.scrollTop < -5) {
        select2Scroll.style.overflow = 'hidden';
      } else {
        select2Scroll.style.overflow = '';
      }
      if (select2Scroll.scrollTop <= 0) {
        if (ev.deltaY > 0) {
          select2Con.style.transform = `translate3d(0, ${ev.distance}px, 0px)`;
          select2Con.style.transition = `none`
        }
        if (ev.isFinal) {
          select2Con.style.transform = ``;
          select2Con.style.transition = ``
        }
        if (ev.deltaTime < 500 && ev.isFinal) {
          el.select2('close')
        }
      } else {
        select2Con.style.transform = ``;
        select2Con.style.transition = ``
      }
    } else {
      select2Con.style.transform = ``;
      select2Con.style.transition = ``
    }
  })
}