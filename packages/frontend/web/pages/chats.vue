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
  <br />
  <br />
  <VContainer fluid>
    <ViewsChat />
  </VContainer>
</template>
