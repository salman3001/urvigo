<script setup lang="ts">
const wishlist = wishlistStore();

const { data, pending } = useAsyncData(() => wishlist.fetchDetailedWishlist());
</script>

<template>
  <h2>My Wishist</h2>
  <br />
  <VRow>
    <VCol v-if="pending" v-for="s in 10" cols="12" md="6" lg="3">
      <VSkeletonLoader type="card" />
    </VCol>
    <VCol v-else v-for="s in data?.items" cols="12" md="6" lg="3">
      <ServiceCard :service="s" />
    </VCol>
  </VRow>
</template>
