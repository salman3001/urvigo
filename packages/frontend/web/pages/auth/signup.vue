<script setup lang="ts">
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";

import authV2RegisterIllustrationBorderedDark from "@images/pages/auth-v2-register-illustration-bordered-dark.png";
import authV2RegisterIllustrationBorderedLight from "@images/pages/auth-v2-register-illustration-bordered-light.png";
import authV2RegisterIllustrationDark from "@images/pages/auth-v2-register-illustration-dark.png";
import authV2RegisterIllustrationLight from "@images/pages/auth-v2-register-illustration-light.png";
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";

const imageVariant = useGenerateImageVariant(
  authV2RegisterIllustrationLight,
  authV2RegisterIllustrationDark,
  authV2RegisterIllustrationBorderedLight,
  authV2RegisterIllustrationBorderedDark,
  true,
);

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);

definePageMeta({
  layout: "blank",
});

const auth = authStore();
const loading = ref(false);
const isPasswordVisible = ref(false);
const { fetchRef } = useFetchRef();
const formRef = ref<null | HTMLFormElement>(null);

const form = ref({
  firstName: "",
  lastName: "",
  businessName: "",
  email: "",
  phone: "",
  password: "",
  passwordConfirmation: "",
  userType: userTypes.USER,
  temp: false,
});

const signup = async () => {
  loading.value = true;
  const { valid } = await formRef.value?.validate();
  if (valid) {
    const res = await auth.signup(form.value);

    if (res?.success == true) {
      const user = useCookie("user", {
        maxAge: 60 * 60 * 24,
      });

      const token = useCookie("token", {
        maxAge: 60 * 60 * 24,
      });

      const socketToken = useCookie("socketToken", {
        maxAge: 60 * 60 * 24,
      });

      user.value = res?.data.user;
      token.value = res?.data.token.token;
      socketToken.value = res?.data?.socketToken;
      fetchRef.value = null;

      navigateTo(routes.home);
    }
  }

  loading.value = false;
};
</script>

<template>
  <NuxtLink to="/">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </NuxtLink>

  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background w-100 me-0">
        <div
          class="d-flex align-center justify-center w-100 h-100"
          style="padding-inline: 100px"
        >
          <VImg
            max-width="500"
            :src="imageVariant"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <img
          class="auth-footer-mask"
          :src="authThemeMask"
          alt="auth-footer-mask"
          height="280"
          width="100"
        />
      </div>
    </VCol>

    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
      style="background-color: rgb(var(--v-theme-surface))"
    >
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <h4 class="text-h4 mb-1">Adventure starts here 🚀</h4>
          <p class="mb-0">Make your app management easy and fun!</p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="signup" ref="formRef">
            <FormErrorAlert v-if="auth.errors" :errors="auth.errors" />
            <VRow>
              <!-- Username -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.firstName"
                  :rules="[requiredValidator]"
                  autofocus
                  label="First Name"
                  placeholder="John"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="form.lastName"
                  :rules="[requiredValidator]"
                  label="Last Name"
                  placeholder="doe"
                />
              </VCol>

              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                  type="email"
                  placeholder="johndoe@email.com"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.password"
                  :rules="[requiredValidator, passwordValidator]"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
                <AppTextField
                  v-model="form.passwordConfirmation"
                  :rules="[
                    requiredValidator,
                    (v: string) => confirmedValidator(v, form.password),
                  ]"
                  label="Confirm Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center my-6">
                  <VCheckbox id="privacy-policy" v-model="form.temp" inline />
                  <VLabel for="privacy-policy" style="opacity: 1">
                    <span class="me-1 text-high-emphasis">I agree to</span>
                    <a href="javascript:void(0)" class="text-primary"
                      >privacy policy & terms</a
                    >
                  </VLabel>
                </div>

                <VBtn block type="submit" :disabled="loading"> Sign up </VBtn>
              </VCol>

              <!-- create account -->
              <VCol cols="12" class="text-center text-base">
                <span class="d-inline-block">Already have an account?</span>
                <NuxtLink
                  class="text-primary ms-1 d-inline-block"
                  :to="routes.auth.login"
                >
                  Sign in instead
                </NuxtLink>
              </VCol>

              <VCol cols="12" class="d-flex align-center">
                <VDivider />
                <span class="mx-4">or</span>
                <VDivider />
              </VCol>

              <!-- auth providers -->
              <VCol cols="12" class="text-center">
                <ViewsWebAuthenticationAuthProvider />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
