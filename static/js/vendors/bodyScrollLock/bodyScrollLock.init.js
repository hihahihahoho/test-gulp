function blockScroll (el) {
  var srcollTarget = document.querySelector(el);
  bodyScrollLock.disableBodyScroll(srcollTarget, {
    allowTouchMove: el => el.tagName === 'TEXTAREA',
  });
}

function enableScroll (el) {
  var srcollTarget = document.querySelector(el);
  bodyScrollLock.enableBodyScroll(srcollTarget);
}