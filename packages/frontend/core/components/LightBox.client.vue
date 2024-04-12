<script setup lang="ts">
import { useEasyLightbox } from "vue-easy-lightbox";

const props = defineProps<{
  images: string[];
  imgMaxHeight?: string;
  imgMaxWidth?: string;
}>();

const {
  // methods
  show,
  onHide,
  changeIndex,
  // refs
  visibleRef,
  indexRef,
  imgsRef,
} = useEasyLightbox({
  // src / src[]
  imgs: props.images,
  // initial index
  initIndex: 0,
});
</script>

<template>
  <div>
    <vue-easy-lightbox
      :visible="visibleRef"
      :imgs="imgsRef"
      :index="indexRef"
      @hide="onHide"
    />
    <div class="d-flex flex-wrap cursor-pointer gap-4">
      <VImg
        class="border"
        fit="contain"
        v-for="(img, i) in images"
        :src="img"
        :height="imgMaxHeight || '140px'"
        :style="{ maxWidth: imgMaxWidth || ' 150px' }"
        @click="
          () => {
            indexRef = i;
            show();
          }
        "
      />
    </div>
  </div>
</template>
