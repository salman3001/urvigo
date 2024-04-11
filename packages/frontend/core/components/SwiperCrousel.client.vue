<script setup lang="ts">
import { register } from "swiper/element/bundle";

defineProps<{
  images: string[];
  height?: string;
}>();

register();
</script>

<template>
  <ClientOnly>
    <swiper-container
      navigation="true"
      pagination="true"
      events-prefix="swiper-"
    >
      <swiper-slide v-for="swiperImg in images" :key="swiperImg">
        <VImg
          cover
          aspect-ratio="16/9"
          :height="height || '400px'"
          :src="swiperImg"
        />
      </swiper-slide>
    </swiper-container>
  </ClientOnly>
</template>
