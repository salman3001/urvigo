<script setup lang="ts">
const props = defineProps<{
  selectedBid: IBid;
  serviceRequirement: IServiceRequirement;
}>();

const emits = defineEmits<{
  (e: "negotiated"): void;
}>();

const model = defineModel<boolean>({ required: true });
const formRef = ref(null);

const {
  create: negotiate,
  form: negotiateForm,
  loading: negotiateOnProgress,
} = useServiceRequirementApi.negotiate();

const submit = async () => {
  negotiateForm.bidId = props.selectedBid.id as unknown as string;
  if (await formRef.value?.validate()) {
    const res = await negotiate(props.serviceRequirement.id);

    if (res?.success == true) {
      emits("negotiated");
    }
  }
};
</script>

<template>
  <ModalBase
    v-model:is-visible="model"
    title="Request a Negotiation"
    subtitle="Please ask a reasonable negotiation. Very high negotiations are most likely be rejected by the vendor"
  >
    <VForm ref="formRef" @submit.prevent="submit">
      <VCardItem class="column q-pa-lg">
        <AppTextField
          type="number"
          v-model="negotiateForm.price"
          label="Request a price"
          :rules="[requiredValidator]"
        />
        <AppTextarea
          v-model="negotiateForm.message"
          label="message"
          :rules="[requiredValidator]"
        />
      </VCardItem>
      <VCardItem class="row justify-end q-pa-lg">
        <VBtn color="primary" type="submit">Submit Request</VBtn>
      </VCardItem>
    </VForm>
  </ModalBase>
</template>
