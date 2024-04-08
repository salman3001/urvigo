<script setup lang="ts">
const { list } = useServiceApi.list({
  orderBy: "created_at:desc",
  perPage: 20,
});

const { data, pending } = await useAsyncData(async () => {
  const data = await list();
  return data.data;
});
</script>

<template>
  <div v-if="!pending">
    <VRow class="gap-2">
      <VCol cols="5" sm="6" md="4" class="gap-4">
        <ServiceCard v-for="s in data?.data" :service="s" class="ma-2" />
      </VCol>
    </VRow>
  </div>
</template>
