<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
}>();

const isVisible = defineModel<boolean>("isVisible");
</script>

<template>
  <VDialog
    v-model="isVisible"
    :width="$vuetify.display.smAndDown ? 'auto' : 600"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isVisible = false" />

    <VCard class="pa-2 pa-sm-10">
      <!-- 👉 Title -->
      <VCardItem class="text-center">
        <VCardTitle>
          <h4 class="text-h4 mb-2">{{ title }}</h4>
        </VCardTitle>
        <p class="text-body-1 mb-0">{{ subtitle }}</p>
      </VCardItem>

      <VCardText class="pt-6">
        <slot />
      </VCardText>
    </VCard>
  </VDialog>
</template>
