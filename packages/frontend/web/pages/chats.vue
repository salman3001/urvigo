<script setup lang="ts">
definePageMeta({
  middleware: "is-logged-in",
  layoutWrapperClasses: "layout-content-height-fixed",
});
</script>

<template>
  <br />
  <br />
  <br />
  <VContainer>
    <ViewsChat />
  </VContainer>
</template>
