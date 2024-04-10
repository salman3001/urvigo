<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";

const props = defineProps<{
  vendor: IVendorUser;
}>();

const { list, query } = useServiceApi.list({
  search: "",
  orderBy: "created_at:desc",
  field__vendor_user_id: props.vendor?.id,
  page: 1,
});

const { data, pending, refresh } = await useAsyncData(
  async () => {
    const data = await list();
    return data.data;
  },
  { watch: [() => query.page] },
);

const debouncedSearch = useDebounceFn(() => {
  refresh();
}, 1000);

watch(
  () => query.search,
  () => {
    debouncedSearch();
  },
);
</script>

<template>
  <VCard>
    <VCardText
      class="d-flex justify-space-between align-center flex-wrap gap-4"
    >
      <h5 class="text-h5">Service List</h5>
      <div style="inline-size: 272px">
        <AppTextField
          v-model="query.search"
          :debounce="500"
          placeholder="Search Project"
        />
      </div>
    </VCardText>
    <VDivider />
    <VCardItem>
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
      <br />
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
    </VCardItem>
  </VCard>
</template>
