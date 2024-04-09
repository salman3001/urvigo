<script lang="ts" setup>
const { injectSkinClasses } = useSkins();

// ℹ️ This will inject classes in body tag for accurate styling
injectSkinClasses();
</script>

<template>
  <div class="layout-wrapper layout-blank">
    <ViewsWebNavbar />
    <slot />
    <ViewsWebFooter />
  </div>
</template>

<style>
.layout-wrapper.layout-blank {
  flex-direction: column;
  gap: 3rem;
}
</style>
