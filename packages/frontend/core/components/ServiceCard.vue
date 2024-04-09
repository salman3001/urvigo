<script setup lang="ts">
import useGetImageUrl from "@/composables/useGetImageUrl";

defineProps<{
  service: IService;
}>();

const getImageUrl = useGetImageUrl();
</script>

<template>
  <VCard class="ma-0" :to="routes.services.view(service?.slug)">
    <VImg
      :src="getImageUrl(service?.thumbnail?.breakpoints?.thumbnail?.url)"
      cover
    />

    <VCardItem>
      <VCardTitle>{{ service.name }}</VCardTitle>
    </VCardItem>

    <VCardText>
      <p class="line-clamp-3">
        {{ service?.short_desc }}
      </p>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.v-btn {
  transform: none;
}
</style>
