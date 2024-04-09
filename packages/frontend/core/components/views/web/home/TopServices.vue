<script setup lang="ts">
const { list } = useServiceApi.list({
  orderBy: "created_at:desc",
  perPage: 12,
});

const { data, pending } = await useAsyncData(async () => {
  const data = await list();
  return data.data;
});
</script>

<template>
  <VContainer id="features" class="py-10">
    <div class="headers d-flex justify-center flex-column align-center">
      <VChip label color="primary" class="mb-4" size="small"
        >Top Services
      </VChip>

      <h4 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
        <div class="position-relative me-2">
          <div class="section-title">Explore excellence</div>
        </div>
      </h4>

      <p class="text-center text-body-1 mb-1">
        Discover Our Permier Selction of Services
      </p>
      <VBtn :to="routes.services.list">View All Services</VBtn>
    </div>
    <br />
    <br />
    <div v-if="!pending">
      <VRow class="">
        <VCol v-for="s in data?.data" cols="12" md="6" lg="3">
          <ServiceCard :service="s" />
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>
