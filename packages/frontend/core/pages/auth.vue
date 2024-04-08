<script setup lang="ts">
definePageMeta({
  layout: "blank",
  middleware: ["is-guest"],
});
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
