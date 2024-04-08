<script setup lang="ts">
import useGetImageUrl from '@/composables/useGetImageUrl';

defineProps<{
    service:IService
}>()

const getImageUrl=useGetImageUrl()
</script>

<template>
      <VCard>
        <VImg
          :src="getImageUrl(service?.thumbnail?.breakpoints?.thumbnail?.url)"
          cover
        />

        <VCardItem>
          <VCardTitle>{{ service.name }}</VCardTitle>
        </VCardItem>

        <VCardText>
          {{ service?.short_desc }}
        </VCardText>
      </VCard>
</template>

<style lang="scss" scoped>
.v-btn {
  transform: none;
}
</style>
