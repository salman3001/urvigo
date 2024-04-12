<script setup lang="ts">
const props = defineProps<{
  items: string[];
}>();
const model = defineModel<string[]>({ required: true });

const itemOptions = ref(props.items);
const search = ref("");

const update = (v: any) => {
  search.value = v;
};
</script>

<template>
  <AppAutocomplete :items="itemOptions" @update:search="update">
    <template v-slot:no-data>
      <v-btn
        @click="
          itemOptions.push(search);
          model.push(search);
          search = '';
        "
      >
        Add Item: {{ search }}</v-btn
      >
    </template>
  </AppAutocomplete>
</template>
