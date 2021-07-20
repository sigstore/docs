<template>
  <div class="slider">
    <!-- directive: render origin html on server & render Swiper on browser -->
    <!-- You can get the swiper instance object in current component context by the name: "mySwiper"  -->
    <div
      v-if="slideData"
      v-swiper:myDirectiveSwiper="swiperOptions"
      class="swiper"
      @ready="onSwiperRedied"
    >
      <div class="swiper-wrapper">
        <div v-for="(slide, index) in slideData" :key="index" class="swiper-slide rounded-xl p-44 bg-orange-medium">
            <div class="w-2/5 md:w-1/5"></div>
            <div class="w-full md:w-4/5 text-left ml-40">
                <p class="text-12 uppercase f-header">Case study</p>
            </div>
        </div>
      </div>
      <div class="swiper-pagination swiper-pagination-bullets"></div>
    </div>
  </div>
</template>

<script>
    // import Card from "@/components/Card.vue";
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
          speed: 10000,
          autoplay: {
            delay: 1,
          },
          loop: true,
          slidesPerView:'auto',
          allowTouchMove: false,
          disableOnInteraction: true
        }
      }
    },
    methods: {
      onSwiperRedied(swiper) {
        console.log('Swiper redied!', swiper)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .slider {
    height: auto;
    .swiper-wrapper{transition-timing-function:linear; }
    .swiper {
      height: 300px;
      width: 100%;
      .swiper-slide {
        text-align: center;
        font-size: 38px;
        font-weight: 700;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        max-width: 700px;
        width: 90%;

        &:nth-child(0){
          background-color: #6349FF;
        }
      }
      .swiper-pagination {
        > .swiper-pagination-bullet {
          background-color: red;
        }
      }
    }
  }
</style>