<script setup lang="ts">
import academyCourseIllustration1 from "@images/pages/academy-course-illustration1.png";
import academyCourseIllustration2 from "@images/pages/academy-course-illustration2.png";

const route = useRoute();

const { list, query } = useServiceApi.list({
  orderBy: "created_at:desc",
  page: 1,
  search: "",
});

const search = ref(route?.query?.search || "");

const { data, pending } = await useAsyncData(
  async () => {
    const data = await list();
    return data.data;
  },
  { watch: [query] },
);

const { list: getCetrgories } = useServiceCategoryApi.list({});
const { data: categories, pending: categoryPending } = await useAsyncData(
  async () => {
    const data = await getCetrgories();
    return data.data;
  },
);

watchDebounced(
  search,
  () => {
    query.search = search.value;
  },
  { debounce: 1000, maxWait: 1000, immediate: true },
);
</script>

<template>
  <VContainer id="features" class="py-5">
    <VCard class="mb-6">
      <VCardText class="py-12 position-relative">
        <div
          class="d-flex flex-column gap-y-4 mx-auto"
          :class="
            $vuetify.display.mdAndUp
              ? 'w-50'
              : $vuetify.display.xs
                ? 'w-100'
                : 'w-75'
          "
        >
          <h4
            class="text-h4 text-center text-wrap mx-auto"
            :class="$vuetify.display.mdAndUp ? 'w-75' : 'w-100'"
          >
            Discover Our Permier Selection of Services
            <span class="text-primary text-no-wrap"> All in one place.</span>
          </h4>
          <p class="text-center text-wrap text-body-1 mx-auto mb-0">
            Explore our service listing page for a wide array of offerings
            tailored to your requirements. From consultations to specialized
            solutions, find the expertise you need at your fingertips.
          </p>
          <div class="d-flex justify-center align-center gap-4 flex-wrap">
            <div class="flex-grow-1" style="max-inline-size: 350px">
              <AppTextField v-model="search" placeholder="Find your course" />
            </div>
            <VBtn
              color="primary"
              density="comfortable"
              icon="tabler-search"
              class="rounded"
            />
          </div>
        </div>
        <img
          :src="academyCourseIllustration1"
          class="illustration1 d-none d-md-block"
          height="180"
        />
        <img
          :src="academyCourseIllustration2"
          class="illustration2 d-none d-md-block"
          height="100"
        />
      </VCardText>
    </VCard>
    <VCard class="mb-6">
      <VCardText>
        <!-- 👉 Header -->
        <div
          class="d-flex justify-space-between align-center flex-wrap gap-4 mb-6"
        >
          <div>
            <h5 class="text-h5">Services</h5>
            <div class="text-body-1">Lorem ipsum dolor sit amet.</div>
          </div>

          <div class="d-flex flex-wrap gap-x-6 gap-y-4 align-center">
            <AppSelect
              v-model="query.orderBy"
              :items="[
                { name: 'None', value: 'created_at:desc' },
                { name: 'Highest Rating', value: 'avg_rating:desc' },
                { name: 'Lowest Price', value: 'starting_from' },
              ]"
              item-title="name"
              item-value="value"
              label="Sort By"
              style="min-inline-size: 260px"
            />
            <AppSelect
              v-if="!categoryPending"
              v-model="query.field__service_category_id"
              :items="[...categories, { name: 'All Services', id: null }]"
              item-title="name"
              item-value="id"
              label="Categories"
              style="min-inline-size: 260px"
            />
          </div>
        </div>
      </VCardText>
    </VCard>
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

.illustration1 {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 0;
}

.illustration2 {
  position: absolute;
  inset-block-start: 2rem;
  inset-inline-start: 2.5rem;
}
</style>
