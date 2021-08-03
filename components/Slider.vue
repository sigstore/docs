<template>
  <div class="slider">
    <!-- directive: render origin html on server & render Swiper on browser -->
    <!-- You can get the swiper instance object in current component context by the name: "mySwiper"  -->
    <div
      v-if="slideData"
      v-swiper:myDirectiveSwiper="swiperOptions"
      class="swiper"
      @mouseenter="stopSwip($event)" 
      @mouseleave="startSwip($event)"
    >
      <div class="swiper-wrapper">
        <div v-for="(slide, index) in slideData" :key="index" :class="`${slide.caseColour}`" class="swiper-slide rounded-xl p-32 md:p-44 md:flex justify-between items-start">
            <div class="w-full md:w-85 md:mb-0 mb-20 flex md:flex-none justify-start items-center">
              <img class="md:w-auto w-1/4" :src="slide.brand" :alt="`${slide.title} Logo`" />
              <p 
                class="text-12 uppercase h block md:hidden pl-16"
                :class="{ 
                  'text-white': slide.caseColour === 'bg-purple-light', 
                  'text-purple-dark': slide.caseColour === 'bg-pastel-blue',
                  'text-orange-dark': slide.caseColour === 'bg-orange-medium', 
                }"
              >{{slide.category}}</p>
            </div>
            <div 
              v-if="slide.body" 
              class="w-full text-left md:ml-40 flex flex-col justify-between items-start min-h-320 relative"
              :class="{ 
                  'text-white': slide.caseColour === 'bg-purple-light', 
                  'text-purple-dark': slide.caseColour === 'bg-pastel-blue',
                  'text-orange-dark': slide.caseColour === 'bg-orange-medium', 
                }"
              >
                <div class="swiper--wrapper-slidetext">
                  <p class="text-12 uppercase h mb-16 hidden md:block">{{slide.category}}</p>
                  <div class="md:mb-40 mb-20 md:min-h-auto min-h-146">   
                    <p class="subheading md:text-24 h">{{ slide.caseStudyText }}</p>
                    <p v-if="slide.name" class="text-12 h leading-15 mt-12">{{slide.name}}<br>{{slide.role}}</p>
                  </div>
                </div>

                <a v-if="slide.caseStudyLink" class="absolute bottom-0 left-0 pt-22 flex items-center h text-12 md:text-16 card--button" :href="slide.caseStudyLink">
                    Learn more
                    <span class="ml-6">
                        <svg 
                          :class="{ 
                            'fill-white-stroke': slide.caseColour === 'bg-purple-light', 
                            'fill-purple-dark-stroke': slide.caseColour === 'bg-pastel-blue',
                            'fill-orange-dark-stroke': slide.caseColour === 'bg-orange-medium', 
                          }" 
                          width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="#444444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M15 3H21V9" stroke="#444444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M10 14L21 3" stroke="#444444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                </a>
            </div>
        </div>
      </div>
      <div class="swiper-pagination swiper-pagination-bullets"></div>
    </div>
  </div>
</template>

<script>
  import 'swiper/css/swiper.min.css'
  export default {
    name: 'SwiperNuxt',
    components: {
        // Card
    },
    props: {
        slideData: {
            type: Array,
            default: null
        },
    },
    data () {
      return {
        swiperOptions: {
          spaceBetween: 40,
          centeredSlides: true,
          speed: 20000,
          autoplay: {
            delay: 1,
          },
          loop: true,
          slidesPerView:'auto',
          allowTouchMove: false,
          // disableOnInteraction: true
        }
      }
    },
    computed: {
      
    },
    methods: {
      stopSwip(event) {
        event.target.swiper.autoplay.stop();
      },
      startSwip(event) {
        event.target.swiper.autoplay.start();
      },
    }
  }
</script>

<style lang="scss" scoped>
  .slider {
    height: auto;
    .swiper-wrapper{
      transition-timing-function:linear; 
    }
    .swiper {
      height: auto;
      width: 100%;
      .swiper-slide {
        text-align: center;
        font-size: 38px;
        font-weight: 700;
        max-width: 700px;
        width: 80%;
        min-height: 430px;
      }
      .swiper-pagination {
        > .swiper-pagination-bullet {
          background-color: red;
        }
      }
    }
  }
</style>