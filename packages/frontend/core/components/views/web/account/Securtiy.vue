<script lang="ts" setup>
const isCurrentPasswordVisible = ref(false);
const isNewPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);

const passwordRequirements = [
  "Minimum 8 characters long - the more, the better",
  "At least one lowercase character",
  "At least one number, symbol, or whitespace character",
];

const { errors, fetcher, loading } = useFetchRef();
const user = useCookie("user") as unknown as Ref<IUser> | null;

const initialForm = {
  old_password: "",
  password: "",
  password_confirmation: "",
  userType: userTypes.USER,
};

const updatePassword = async (
  reset: () => void,
  resetValidation: () => void,
) => {
  try {
    const data = await fetcher<IResType<any>>(
      apiRoutes.auth.updatePassword(user!.value.id),
      {
        method: "post",
        body: form.value,
      },
    );

    if (data.success == true) {
      resetValidation();
      reset();
    }
  } catch (error) {
    console.log(error);
  }
};

const form = ref(initialForm);
</script>

<template>
  <VRow>
    <!-- SECTION: Change Password -->
    <VCol cols="12">
      <VCard title="Change Password">
        <FormCustom
          v-slot="{ resetForm, resetValidations }"
          @submit="updatePassword"
        >
          <VCardText class="pt-0">
            <!-- 👉 Current Password -->
            <FormErrorAlert v-if="errors" :errors="errors" />
            <VRow>
              <VCol cols="12" md="6">
                <!-- 👉 current password -->
                <AppTextField
                  v-model="form.old_password"
                  :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isCurrentPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  label="Current Password"
                  autocomplete="on"
                  placeholder="············"
                  @click:append-inner="
                    isCurrentPasswordVisible = !isCurrentPasswordVisible
                  "
                  :rules="[requiredValidator]"
                />
              </VCol>
            </VRow>

            <!-- 👉 New Password -->
            <VRow>
              <VCol cols="12" md="6">
                <!-- 👉 new password -->
                <AppTextField
                  v-model="form.password"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  label="New Password"
                  autocomplete="on"
                  placeholder="············"
                  @click:append-inner="
                    isNewPasswordVisible = !isNewPasswordVisible
                  "
                  :rules="[requiredValidator, passwordValidator]"
                />
              </VCol>

              <VCol cols="12" md="6">
                <!-- 👉 confirm password -->
                <AppTextField
                  v-model="form.password_confirmation"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  label="Confirm New Password"
                  autocomplete="on"
                  placeholder="············"
                  @click:append-inner="
                    isConfirmPasswordVisible = !isConfirmPasswordVisible
                  "
                  :rules="[
                    requiredValidator,
                    (v: string) => confirmedValidator(v, form.password),
                  ]"
                />
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Password Requirements -->
          <VCardText>
            <h6 class="text-h6 text-medium-emphasis mb-4">
              Password Requirements:
            </h6>

            <VList class="card-list">
              <VListItem
                v-for="item in passwordRequirements"
                :key="item"
                :title="item"
                class="text-medium-emphasis"
              >
                <template #prepend>
                  <VIcon size="10" icon="tabler-circle-filled" />
                </template>
              </VListItem>
            </VList>
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn type="submit" :disabled="loading">Save changes</VBtn>

            <VBtn type="reset" color="secondary" variant="tonal"> Reset </VBtn>
          </VCardText>
        </FormCustom>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 16px;
}

.server-close-btn {
  inset-inline-end: 0.5rem;
}
</style>
