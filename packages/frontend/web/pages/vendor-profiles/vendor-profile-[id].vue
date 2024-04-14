<script lang="ts" setup>
const route = useRoute();

const activeTab = ref("profile");

const { show } = useVendorApi.show();

const { data, pending } = await useAsyncData(async () => {
  const data = await show(route.params.id);
  return data.data;
});
</script>

<template>
  <div v-if="!pending">
    <ViewsWebVendorProfileHeader :profile-header-data="data!" />

    <v-container>
      <VTabs v-model="activeTab" class="v-tabs-pill my-2">
        <VTab>
          <VIcon size="20" start icon="tabler-user-check" value="profile" />
          Profile
        </VTab>
        <VTab>
          <VIcon size="20" start icon="tabler-server" value="services" />
          Services
        </VTab>
        <VTab>
          <VIcon
            size="20"
            start
            icon="tabler-device-desktop-star"
            value="reviews"
          />
          Reviews
        </VTab>
      </VTabs>

      <ClientOnly>
        <VWindow
          v-model="activeTab"
          class="disable-tab-transition"
          :touch="false"
        >
          <!-- Profile -->
          <VWindowItem value="profile">
            <ViewsWebVendorProfileAbout :vendor="data!" />
          </VWindowItem>

          <!-- services -->
          <VWindowItem value="services">
            <ViewsWebVendorProfileServiceList :vendor="data!" />
          </VWindowItem>

          <!-- Reviews -->
          <VWindowItem value="reviews">
            <ViewsWebVendorProfileReviews
              :avg_rating="Number(data?.avg_rating || 0)"
              :reviews_count="data?.meta?.reviews_count || 0"
              :vendor-id="data!.id"
            />
          </VWindowItem>
        </VWindow>
      </ClientOnly>
    </v-container>
    <br />
  </div>
</template>
