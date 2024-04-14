<script setup lang="ts">
import avatar from "@images/dummy-avatar.webp";

const { user } = useAuth();
const getImageUrl = useGetImageUrl();

const { form, loading, update, errors } = useUserApi.updateProfile({
  image: undefined,
  firstName: user.value.first_name,
  lastName: user.value.last_name,
  email: user.value.email,
  phone: user.value.phone,
});

const updateProfile = async () => {
  const res = await update(user.value.id);
  if (res?.success == true) {
    user.value = res.data;
  }
};
</script>

<template>
  <VCard>
    <!-- 👉 Avatar -->
    <VCardText class="d-flex">
      <FormAvatarInput
        size="100"
        :url="
          getImageUrl(
            user?.profile?.avatar?.breakpoints?.thumbnail?.url,
            avatar,
          )
        "
        @image="
          (f) => {
            form.image = f;
          }
        "
      />
    </VCardText>

    <VCardText class="pt-2">
      <!-- 👉 Form -->
      <FormCustom @submit="updateProfile" class="mt-3">
        <VRow>
          <!-- 👉 First Name -->
          <VCol md="6" cols="12">
            <AppTextField
              v-model="form.firstName"
              placeholder="John"
              label="First Name"
              :rules="[requiredValidator]"
            />
          </VCol>

          <!-- 👉 Last Name -->
          <VCol md="6" cols="12">
            <AppTextField
              v-model="form.lastName"
              placeholder="Doe"
              label="Last Name"
              :rules="[requiredValidator]"
            />
          </VCol>

          <!-- 👉 Email -->
          <VCol cols="12" md="6">
            <AppTextField
              v-model="form.email"
              label="E-mail"
              placeholder="johndoe@gmail.com"
              type="email"
              :rules="[requiredValidator, emailValidator]"
            />
          </VCol>

          <!-- 👉 Phone -->
          <VCol cols="12" md="6">
            <AppTextField
              v-model="form.phone"
              label="Phone Number"
              placeholder="+1 (917) 543-9876"
              :rules="[requiredValidator]"
            />
          </VCol>

          <!-- 👉 Form Actions -->
          <VCol cols="12" class="d-flex flex-wrap gap-4">
            <VBtn type="submit">Save changes</VBtn>

            <VBtn
              color="secondary"
              variant="tonal"
              type="reset"
              @click.prevent="() => {}"
            >
              Cancel
            </VBtn>
          </VCol>
        </VRow>
      </FormCustom>
    </VCardText>
  </VCard>
</template>
