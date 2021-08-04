import Vue from 'vue'
import { Swiper as SwiperClass, Pagination, Mousewheel, Autoplay } from 'swiper/swiper.esm'
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
SwiperClass.use([Pagination, Mousewheel, Autoplay])
Vue.use(getAwesomeSwiper(SwiperClass))


const config = {
  rootMargin: '0px',
  threshold: [.2, .6]
};

const animateOnScrollObserver = new IntersectionObserver(function (entries, animateOnScrollObserver) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.intersectionRatio > 0.1) {
          // entry.target.classList.add('enter')
          const headerEl = document.querySelector('header');
          // intersection ratio bigger than 90%
          // -> set header according to target
          entry.target.classList.add('enter')
          animateOnScrollObserver.unobserve(entry.target)
          const sectionText = entry.target.closest('section').dataset.headerText;
          headerEl.classList.toggle(sectionText);
            
            if (entry.target.getBoundingClientRect().top < 0 ) {
              animateOnScrollObserver.unobserve(entry.target)
            }
        }
      }
    })
}, config);

Vue.directive('animate-on-scroll', {
  bind: el => {
    el.classList.add('before-enter')
    animateOnScrollObserver.observe(el)
  }
})


// register widget here
// window.CMS.registerWidget("color", ColorControl, ColorPreview);
