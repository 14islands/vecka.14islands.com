export default (element, start, destination, duration = 200, easing = 'linear', callback) => {

  // define timing functions
  const easings = {
    linear (t) {
      return t
    },
    easeInQuad (t) {
      return t * t
    },
    easeOutQuad (t) {
      return t * (2 - t)
    },
    easeInOutQuad (t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    },
    easeInCubic (t) {
      return t * t * t
    },
    easeOutCubic (t) {
      return (--t) * t * t + 1
    },
    easeInOutCubic (t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    },
    easeInQuart (t) {
      return t * t * t * t
    },
    easeOutQuart (t) {
      return 1 - (--t) * t * t * t
    },
    easeInOutQuart (t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
    },
    easeInQuint (t) {
      return t * t * t * t * t
    },
    easeOutQuint (t) {
      return 1 + (--t) * t * t * t * t
    },
    easeInOutQuint (t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
    }
  }

  const startTime = Date.now()

  function scroll() {
    const now = Date.now()
    const time = Math.min(1, ((now - startTime) / duration));
    const timeFunction = easings[easing](time);
    element.scrollLeft = (timeFunction * (destination - start)) + start;

    if (element.scrollLeft === destination) {
      //callback();
      return;
    }
    requestAnimationFrame(scroll);
  }
  scroll();
}
