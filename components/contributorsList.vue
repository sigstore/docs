<template>
    <section class="py-32 bg-pastel-orange" data-header-text="text-gray-dark">
        <div class="container inner text-center text-orange-dark mb-32">
            <p>Thanks to the dedicated support of all our active community.</p>
        </div>
        <div class="md:flex justify-between">
            <div class="w-full slider">
                <div
                    v-swiper:myDirectiveSwiper="swiperOptions"
                    class="swiper"
                    >
                    <div class="swiper-wrapper">
                        <div v-for="(slide, index) in names" :key="index" class="swiper-slide">
                            <p class="h text-orange-dark text-24 leading-32">{{ slide }}.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script lang="js">
// import LinkButton from "@/assets/icons/link.svg";
export default {

    components: {
        // LinkButton
    },

    data: () => ({
        articlesArray: {
            type: Array,
            default: null
        },
        swiperOptions: {
          spaceBetween: 20,
          centeredSlides: false,
          speed: 10000,
          autoplay: {
            delay: 1,
          },
          loop: true,
          slidesPerView: 'auto',
          allowTouchMove: false,
          disableOnInteraction: true
        },
        names: [
            'Cindy Yang','Claudio Martins','Clayton Dewey','David Torres','Deni Morales','Doran Black','Cindy Yang','Claudio Martins','Clayton'  
        ]
    }),

    computed: {
    },

    created() {
    },

    methods: {
    },

};
</script>
<style lang="scss" scoped>
  .slider {
    height: auto;
    .swiper-wrapper{transition-timing-function:linear; }
    .swiper {
      height: auto;
      width: 100%;
      .swiper-slide {
        text-align: center;
        width: fit-content;
        display: flex;
      }
      .swiper-pagination {
        > .swiper-pagination-bullet {
          background-color: red;
        }
      }
    }
  }
</style>