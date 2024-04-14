<script setup lang="ts">
const props = defineProps<{
  errors?: {
    field: string;
    message: string;
    rule: string;
  }[];
}>();
</script>

<template>
  <VAlert variant="tonal" color="error" v-if="errors">
    <ul>
      <li v-for="(e, i) in errors" :key="i" class="normalcase">
        {{ e.field }} -- {{ e.message }}
      </li>
    </ul>
  </VAlert>
</template>
