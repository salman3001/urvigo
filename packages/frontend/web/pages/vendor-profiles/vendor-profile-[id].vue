<script lang="ts" setup>

definePageMeta({
  navActiveLink: "pages-user-profile-tab",
  key: "tab",
});

const route = useRoute("pages-user-profile-tab");

const activeTab = computed({
  get: () => route.params.tab,
  set: () => route.params.tab,
});

// tabs
const tabs = [
  { title: "Profile", icon: "tabler-user-check", tab: "profile" },
  { title: "Team", icon: "tabler-users", tab: "teams" },
  { title: "Services", icon: "tabler-layout-grid", tab: "services" },
  { title: "Connections", icon: "tabler-link", tab: "connections" },
];
</script>

<template>
  <div>
    <ViewsWebVendorProfileUserProfileHeader />

    <VTabs v-model="activeTab" class="v-tabs-pill my-2">
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
        :to="{ name: 'pages-user-profile-tab', params: { tab: item.tab } }"
      >
        <VIcon size="20" start :icon="item.icon" />
        {{ item.title }}
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
          <ViewsWebVendorProfile />
        </VWindowItem>

        <!-- Projects -->
        <VWindowItem value="services">
          </>
        </VWindowItem>
      </VWindow>
    </ClientOnly>
  </div>
</template>
