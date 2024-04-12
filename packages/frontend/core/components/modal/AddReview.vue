<script setup lang="ts">
const {
  cretae_review: createServiceReview,
  form: serviceReviewForm,
  loading: creatingServiceReview,
  errors: serviceErrors,
} = useServiceApi.cretae_review();
const {
  cretaeReview: createVendorReview,
  form: vendorReviewForm,
  loading: creatingVendorReview,
  error: vendorErrors,
} = useVendorApi.cretaeReview();

const isVisible = defineModel<boolean>("isVisible");
const formRef = ref();

const props = defineProps<{
  serviceId?: number;
  vendorId?: number;
}>();

const emit = defineEmits<{
  (e: "submit"): void;
}>();

const formSubmit = async () => {
  const { valid } = await formRef.value?.validate();
  if (props.serviceId && valid) {
    await createServiceReview(props.serviceId);

    if (!serviceErrors.value) {
      console.log("çalled");

      emit("submit");
    }
  }

  if (props.vendorId && valid) {
    await createVendorReview(props.vendorId);
    if (!vendorErrors.value) {
      emit("submit");
    }
  }
};
</script>

<template>
  <ModalBase
    v-model:is-visible="isVisible"
    title="Add Review"
    subtitle="Share your thoughts about this service"
  >
    <VForm fast-fail @submit.prevent="() => formSubmit()" ref="formRef">
      <FormErrorAlert v-if="serviceErrors" :errors="serviceErrors" />
      <FormErrorAlert v-if="vendorErrors" :errors="vendorErrors" />
      <br />
      <VRow>
        <!-- 👉 Card Number -->
        <VCol cols="12" class="d-flex justify-center">
          <VRating
            v-if="serviceId"
            v-model="serviceReviewForm.rating"
            label="Rating"
            :rules="[requiredValidator]"
          />
          <VRating
            v-if="vendorId"
            v-model="vendorReviewForm.rating"
            label="Rating"
            :rules="[requiredValidator]"
          />
        </VCol>

        <!-- 👉 Card Name -->
        <VCol cols="12" md="12">
          <AppTextarea
            v-if="serviceId"
            v-model="serviceReviewForm.message"
            label="Message"
            :rules="[requiredValidator]"
          />
          <AppTextarea
            v-if="vendorId"
            v-model="vendorReviewForm.message"
            label="Message"
            :rules="[requiredValidator]"
          />
        </VCol>
        <!-- 👉 Card actions -->
        <VCol cols="12" class="text-center">
          <VBtn class="me-4" type="submit"> Submit </VBtn>
          <VBtn color="secondary" variant="tonal" @click="isVisible = false">
            Cancel
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </ModalBase>
</template>
