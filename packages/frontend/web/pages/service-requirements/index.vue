<script setup lang="ts">
import { format } from "date-fns";
definePageMeta({
  middleware: "is-logged-in",
});

const filterModal = ref(false);
const filter = ref(null);
const postModal = ref(false);

const { list, query } = useServiceRequirementApi.myList({
  orderBy: "created_at:desc",
  page: 1,
});

watch(filter, (newFilterValue) => {
  if (newFilterValue == "active") {
    query.where_active = 1;
    query.where_acepted = null;
    query.where_expires_at_lt = null;
  }

  if (newFilterValue == "accepted") {
    query.where_active = null;
    query.where_acepted = 1;
    query.where_expires_at_lt = null;
  }

  if (newFilterValue == "expired") {
    query.where_active = null;
    query.where_acepted = 1;
    query.where_expires_at_lt = format(Date.now(), "YYYY/MM/DD hh:mm:ss");
  }
});

const {
  data: serviceRequirements,
  pending,
  refresh,
} = await useAsyncData(async () => {
  const data = await list();

  return data.data;
});
</script>

<template>
  <br />
  <br />
  <br />
  <br />
  <VContainer id="team">
    <div class="q-gutter-y-xl">
      <br />
      <div class="">
        <h2>Service Requirements</h2>
        <br />
        <br />
        <div class="d-flex flex-wrap justify-end gap-2">
          <div class="normalcase">
            <VChip color="info" icon="filter_alt"
              >filtering by {{ filter }}
            </VChip>
            <VChip
              @click="
                () => {
                  filter = null;
                  refresh();
                }
              "
            >
              <VIcon icon="tabler-x" />
            </VChip>
          </div>
          <IconBtn @click="filterModal = true">
            <VIcon icon="tabler-filter" />
          </IconBtn>
          <VBtn color="primary" @click="() => (postModal = true)"
            >+ Post A Requirement</VBtn
          >
        </div>
        <br />
      </div>
      <div class="">
        <div style="max-width: 95vw">
          <div class="q-gutter-y-md">
            <div v-if="pending" v-for="n in 5">
              <VSkeletonLoader type="list" />
            </div>
            <VRow v-else>
              <VCol
                v-for="requirement in serviceRequirements?.data"
                cols="12"
                lg="6"
              >
                <RequirementCard :requirement="requirement" />
              </VCol>
            </VRow>
            <br />
            <TablePagination
              :page="Number(query.page)"
              :items-per-page="Number(serviceRequirements?.meta?.per_page)"
              :total-items="Number(serviceRequirements?.meta?.total)"
              @update:page="
                (p) => {
                  query.page = p;
                }
              "
            />
          </div>
        </div>
      </div>
    </div>
  </VContainer>
  <ModalPostRequirement
    v-model:is-visible="postModal"
    @submit="
      () => {
        refresh();
        postModal = false;
      }
    "
  />
</template>
