<script setup lang="ts">
const props = defineProps<{
  vendorId: number;
  avg_rating: number;
  reviews_count: number;
}>();

const { reviews } = useVendorApi.reviews({
  page: 1,
});

const { data, pending } = useAsyncData(async () => {
  const data = await reviews(props.vendorId);
  return data.data;
});
</script>

<template>
  <ReviewsOverview :total-reviews="reviews_count" :rating="avg_rating" />
  <br />
  <div v-if="!pending">
    <VRow class="">
      <VCol v-for="r in data?.data" cols="12" md="6" lg="3">
        <ReviewsCard :review="r" />
      </VCol>
    </VRow>
  </div>
  <div v-else>
    <VRow class="">
      <VCol v-for="s in 10" cols="12" md="6" lg="3">
        <VSkeletonLoader type="card" />
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
