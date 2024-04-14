<script setup lang="ts">
definePageMeta({
  disableSearchbar: true,
});
</script>

<template>
  <div class="landing-page-wrapper">
    <!-- 👉 Hero Section  -->
    <ViewsWebHomeHeroSection ref="refHome" />

    <!-- top services -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <ViewsWebHomeTopServices />
    </div>

    <!-- 👉 Startup as Vendor  -->
    <ViewsWebHomeBanner />

    <!-- 👉 Vendor features  -->

    <ViewsWebHomeFeatures ref="refFeatures" />

    <!-- 👉 Customer Review -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <!-- <CustomersReview /> -->
    </div>

    <!-- 👉 Our Team -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <ViewsWebHomeOurTeam ref="refTeam" />
    </div>

    <!-- 👉 Pricing Plans -->
    <!-- <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
            <PricingPlans />
        </div> -->

    <!-- 👉 FAQ Section -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <ViewsWebHomeFaqSection ref="refFaq" />
    </div>

    <!-- 👉 Contact Us  -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <ViewsWebHomeContactUs ref="refContact" />
    </div>
  </div>
</template>

<style lang="scss">
@media (max-width: 960px) and (min-width: 600px) {
  .landing-page-wrapper {
    .v-container {
      padding-inline: 2rem !important;
    }
  }
}
</style>
