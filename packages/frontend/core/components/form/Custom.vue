<script setup lang="ts">
const formRef = ref<null | HTMLFormElement>(null);
const emit = defineEmits<{
  (e: "submit", resetForm: () => void, resetValidation: () => void): void;
}>();

const resetForm = () => {
  formRef.value?.reset();
};

const resetValidation = () => {
  formRef.value?.resetValidation();
};

const submit = async () => {
  const { valid } = await formRef.value?.validate();

  if (valid) {
    emit("submit", resetForm, resetValidation);
  }
};
</script>

<template>
  <VForm ref="formRef" @submit.prevent="submit">
    <slot :resetForm="resetForm" :resetValidations="resetValidations" />
  </VForm>
</template>
