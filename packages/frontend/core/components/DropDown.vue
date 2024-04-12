<script setup lang="ts">
defineProps<{
  name: string;
  leftIcon?: string;
}>();
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props"
        ><VIcon v-if="leftIcon" :icon="leftIcon" />&nbsp; {{ name }}
      </v-btn>
    </template>
    <v-list>
      <slot />
    </v-list>
  </v-menu>
</template>
