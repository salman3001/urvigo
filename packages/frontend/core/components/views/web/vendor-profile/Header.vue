<script lang="ts" setup>
import dummyAvatar from "@/assets/images/dummy-avatar.webp";
import cover from "@/assets/images/pages/user-profile-header-bg.png";
import { format } from "date-fns";

const getImageUrl = useGetImageUrl();
defineProps<{
  profileHeaderData: IVendorUser;
}>();

// const { data, error } = await useApi<ProfileHeader>('/pages/profile/header')

// if (error.value) {
//   console.log(error.value)
// }
// else {
//   if (data.value)
//     profileHeaderData.value = data.value
// }
</script>

<template>
  <VCard>
    <VImg :src="cover" min-height="125" max-height="250" cover />

    <VCardText
      class="d-flex align-bottom flex-sm-row flex-column justify-center gap-x-6"
    >
      <div class="d-flex h-0">
        <VAvatar
          rounded
          size="130"
          :image="
            getImageUrl(
              profileHeaderData?.profile?.avatar?.breakpoints?.thumbnail?.url,
              dummyAvatar,
            )
          "
          class="user-profile-avatar mx-auto"
        />
      </div>

      <div class="user-profile-info w-100 mt-16 pt-6 pt-sm-0 mt-sm-0">
        <h4 class="text-h4 text-center text-sm-start font-weight-medium mb-2">
          {{ profileHeaderData?.first_name }}
          {{ profileHeaderData?.last_name }}
        </h4>

        <div
          class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-5"
        >
          <div
            class="d-flex flex-wrap justify-center justify-sm-start flex-grow-1 gap-6"
          >
            <span class="d-flex gap-x-2 align-center">
              <VIcon size="24" icon="tabler-palette" />
              <div class="text-body-1 font-weight-medium">
                {{ profileHeaderData?.business_name }}
              </div>
            </span>

            <span class="d-flex gap-x-2 align-center">
              <VIcon size="24" icon="tabler-map-pin" />
              <div class="text-body-1 font-weight-medium">Near by you</div>
            </span>

            <span class="d-flex gap-x-2 align-center">
              <VIcon size="24" icon="tabler-calendar" />
              <div
                class="text-body-1 font-weight-medium"
                v-if="profileHeaderData?.created_at"
              >
                {{ format(profileHeaderData?.created_at, "dd/MM/yyyy") }}
              </div>
            </span>
          </div>

          <!-- <VBtn prepend-icon="tabler-user-check"> Connected </VBtn> -->
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.user-profile-avatar {
  border: 5px solid rgb(var(--v-theme-surface));
  background-color: rgb(var(--v-theme-surface)) !important;
  inset-block-start: -3rem;

  .v-img__img {
    border-radius: 0.125rem;
  }
}
</style>
