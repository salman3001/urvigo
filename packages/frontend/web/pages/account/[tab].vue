<script lang="ts" setup>
const route = useRoute("account-tab");

const activeTab = computed({
  get: () => route.params.tab,
  set: () => route.params.tab,
});

// tabs
const tabs = [
  { title: "Account", icon: "tabler-users", tab: "profile" },
  { title: "Security", icon: "tabler-lock", tab: "security" },
  { title: "Notifications", icon: "tabler-bell", tab: "notification" },
  { title: "Wishlist", icon: "tabler-heart", tab: "wishlist" },
];

definePageMeta({
  navActiveLink: "account-tab",
});
</script>

<template>
  <VContainer>
    <br />
    <br />
    <br />
    <br />
    <div>
      <VTabs v-model="activeTab" class="v-tabs-pill">
        <VTab
          v-for="item in tabs"
          :key="item.icon"
          :value="item.tab"
          :to="{ name: 'account-tab', params: { tab: item.tab } }"
        >
          <VIcon size="20" start :icon="item.icon" />
          {{ item.title }}
        </VTab>
      </VTabs>

      <ClientOnly>
        <VWindow
          v-model="activeTab"
          class="mt-6 disable-tab-transition"
          :touch="false"
        >
          <!-- Account -->
          <VWindowItem value="profile">
            <ViewsWebAccountProfile />
          </VWindowItem>

          <!-- Security -->
          <VWindowItem value="security">
            <ViewsWebAccountSecurtiy />
          </VWindowItem>

          <!-- wishlist -->
          <VWindowItem value="wishlist">
            <ViewsWebAccountWishlist />
          </VWindowItem>

          <!-- Notification -->
          <VWindowItem value="notification">
            <ViewsWebAccountNotification />
          </VWindowItem>
        </VWindow>
      </ClientOnly>
    </div>
  </VContainer>
</template>
