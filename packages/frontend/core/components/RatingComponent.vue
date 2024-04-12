<script setup lang="ts">
defineProps<{
  size?: "x-small" | "small" | "x-small" | "large" | "x-large";
}>();
</script>
<template>
  <VRating readonly density="compact" class="me-3" :size="size" />
</template>
