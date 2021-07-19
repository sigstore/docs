import Vue from 'vue'

import VueAwesomeSwiper from 'vue-awesome-swiper'

Vue.use(VueAwesomeSwiper)

const animateOnScrollObserver = new IntersectionObserver(
  (entries, animateOnScrollObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('enter')
        // if(entry.target.parentNode.parentNode.parentNode.classList.contains('bg-white')){
        // }
        animateOnScrollObserver.unobserve(entry.target)
      }
    })
  }
)

Vue.directive('animate-on-scroll', {
  bind: el => {
    el.classList.add('before-enter')
    animateOnScrollObserver.observe(el)
  }
})


// register widget here
// window.CMS.registerWidget("color", ColorControl, ColorPreview);
