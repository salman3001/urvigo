<script setup lang="ts">
import NavSearchBar from "@/layouts/components/NavSearchBar.vue";

const { list, query } = useServiceApi.list({
  orderBy: "created_at:desc",
  page: 1,
});

const { data, pending } = await useAsyncData(
  async () => {
    const data = await list();
    return data.data;
  },
  { watch: [query] },
);
</script>

<template>
  <VContainer id="features" class="py-10">
    <div class="headers d-flex justify-center flex-column align-center">
      <h4 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
        <div class="position-relative me-2">
          <div class="section-title">Explore excellence</div>
        </div>
      </h4>

      <p class="text-center text-body-1 mb-1">
        Discover Our Permier Selection of Services
      </p>
      <br />
      <div class="search-bar-wrapper">
        <NavSearchBar :inputVisible="true" />
      </div>
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
    <div v-else>
      <VRow class="">
        <VCol v-for="s in 10" cols="12" md="6" lg="3">
          <VSkeletonLoader type="card" />
        </VCol>
      </VRow>
    </div>
    <div>
      <TablePagination
        :page="Number(query.page)"
        :items-per-page="Number(data?.meta?.per_page)"
        :total-items="Number(data?.meta?.total)"
        @update:page="
          (p) => {
            query.page = p;
          }
        "
      />
    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
.search-bar-wrapper {
  width: 100%;
  min-width: 200px !important;
  max-width: 700px !important;
}
</style>
