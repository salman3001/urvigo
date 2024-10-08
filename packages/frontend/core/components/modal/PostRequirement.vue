<script setup lang="ts">
const isVisible = defineModel<boolean>("isVisible");
const formRef = ref();

const emit = defineEmits<{
  (e: "submit"): void;
}>();

const { form, create, loading, errors } = useServiceRequirementApi.cretae();
const { list: getCetgoryList } = useServiceCategoryApi.list({});
const { list: getTagList } = useServiceTagApi.list({});

const { data, pending } = useAsyncData(async () => {
  const [categeories, tags] = await Promise.all([
    await getCetgoryList(),
    await getTagList(),
  ]);
  return {
    categories: categeories.data,
    tags: tags.data,
  };
});

const creatRequirement = async () => {
  const { valid } = await formRef.value?.validate();
  if (valid) {
    await create({
      onSuccess: () => {
        emit("submit");
      },
    });
  }
};
</script>

<template>
  <ModalBase
    v-model:is-visible="isVisible"
    title="Add Service Requirement"
    subtitle="Please specify your service requirement"
  >
    <VForm
      ref="formRef"
      class="q-gutter-y-sm"
      @submit.prevent="creatRequirement"
    >
      <VRow>
        <VCol cols="12">
          <FormErrorAlert v-if="errors" :errors="errors" />
        </VCol>
        <VCol cols="12">
          <AppTextField
            v-model="form.title"
            label="Enter Your Title"
            :rules="[requiredValidator]"
            lazy-rules="true"
          />
        </VCol>
        <VCol cols="12">
          <AppTextarea
            v-model="form.desc"
            label="Requirement Detail"
            class="col-12 col-sm-6 col-md-3"
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12">
          <AppSelect
            label="Select Category"
            :rules="[requiredValidator]"
            :items="data?.categories"
            item-title="name"
            item-value="id"
            v-model="form.serviceCategoryId"
          />
        </VCol>
        <VCol cols="12">
          <FormSelectOrAdd
            label="Select Kewwords"
            v-model="form.keywords"
            :items="data?.tags?.map((t) => t.name) || []"
            placeholder="Select Kewwords"
            chips
            multiple
            closable-chips
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12">
          <VSwitch v-model="form.urgent" label="Need In short Time?" />
        </VCol>
        <VCol cols="12">
          <AppTextField
            type="number"
            v-model="form.budget"
            label="Budget"
            :rules="[requiredValidator, (v: any) => minNumValidator(v, 1)]"
          />
        </VCol>
        <VCol cols="12">
          <FormSelectOrAdd
            label="Budget Units"
            v-model="form.budgetUnit"
            :items="['Hourly', 'Fixed', 'Per Unit', 'Monthly']"
            placeholder="Select a Budget Unit"
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12">
          <AppTextField
            v-model="form.location"
            label="Location"
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12">
          <VCard border class="mb-6">
            <VCardItem>
              <template #title> Images </template>
            </VCardItem>

            <VCardText>
              <DropZone
                :max="5"
                @change="(images) => (form.images = images.map((i) => i.file))"
              />
            </VCardText>
          </VCard>
        </VCol>
        <!-- 👉 Card actions -->
        <VCol cols="12" class="text-center">
          <VBtn class="me-4" type="submit" :disabled="loading">
            <VProgressCircular indeterminate color="primary" v-if="loading" />
            Submit
          </VBtn>
          <VBtn color="secondary" variant="tonal" @click="isVisible = false">
            Cancel
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </ModalBase>
</template>
