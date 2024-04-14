<script lang="ts" setup>
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import dummyAvatar from "@images/dummy-avatar.webp";

defineEmits<{
  (e: "close"): void;
}>();

defineProps<{
  selectedParticipant?: IAdminUser | IVendorUser | IUser;
}>();

const getImageUrl = useGetImageUrl();
</script>

<template>
  <template v-if="selectedParticipant">
    <!-- Close Button -->
    <div
      class="pt-6 px-6"
      :class="$vuetify.locale.isRtl ? 'text-left' : 'text-right'"
    >
      <IconBtn @click="$emit('close')">
        <VIcon icon="tabler-x" class="text-medium-emphasis" />
      </IconBtn>
    </div>

    <!-- User Avatar + Name + Role -->
    <div class="text-center px-6">
      <VBadge
        location="bottom right"
        offset-x="7"
        offset-y="4"
        bordered
        :color="'success'"
        class="chat-user-profile-badge mb-5"
      >
        <VAvatar size="84" :variant="'tonal'" :color="'success'">
          <VImg
            v-if="selectedParticipant?.profile?.avatar"
            :src="
              getImageUrl(
                selectedParticipant?.profile?.avatar?.breakpoints?.thumbnail
                  ?.url,
                dummyAvatar,
              )
            "
            :alt="
              selectedParticipant?.first_name ||
              '' + ' ' + selectedParticipant?.last_name
            "
          />
          <span v-else class="text-3xl">{{
            avatarText(
              selectedParticipant?.first_name ||
                "" + " " + selectedParticipant?.last_name,
            )
          }}</span>
        </VAvatar>
      </VBadge>
      <h5 class="text-h5">
        {{
          selectedParticipant?.first_name ||
          "" + " " + selectedParticipant?.last_name
        }}
      </h5>
      <p class="text-capitalize text-body-1 mb-0">
        {{ selectedParticipant.userType }}
      </p>
    </div>

    <!-- User Data -->
    <PerfectScrollbar
      class="ps-chat-user-profile-sidebar-content text-medium-emphasis pb-6 px-6"
      :options="{ wheelPropagation: false }"
    >
      <!-- About -->
      <div class="my-6">
        <div class="text-sm text-disabled">ABOUT</div>
        <p class="mt-1 mb-6">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus,
          iure?
        </p>
      </div>

      <!-- Personal Information -->
      <div class="mb-6">
        <div class="text-sm text-disabled mb-1">PERSONAL INFORMATION</div>
        <div class="d-flex align-center text-high-emphasis pa-2">
          <VIcon class="me-2" icon="tabler-mail" size="22" />
          <div class="text-base">{{ selectedParticipant.email }}</div>
        </div>
        <div class="d-flex align-center text-high-emphasis pa-2">
          <VIcon class="me-2" icon="tabler-phone" size="22" />
          <div class="text-base">{{ selectedParticipant.phone }}</div>
        </div>
        <div class="d-flex align-center text-high-emphasis pa-2">
          <VIcon class="me-2" icon="tabler-clock" size="22" />
          <div class="text-base">Mon - Fri 10AM - 8PM</div>
        </div>
      </div>

      <!-- Options -->
      <div>
        <div class="text-sm text-disabled mb-1">OPTIONS</div>
        <div class="d-flex align-center text-high-emphasis pa-2">
          <VIcon class="me-2" icon="tabler-badge" size="22" />
          <div class="text-base">Add Tag</div>
        </div>
        <div class="d-flex align-center text-high-emphasis pa-2">
          <VIcon class="me-2" icon="tabler-star" size="22" />
          <div class="text-base">Important Contact</div>
        </div>
        <div class="d-flex align-center text-high-emphasis pa-2">
          <VIcon class="me-2" icon="tabler-photo" size="22" />
          <div class="text-base">Shared Media</div>
        </div>
        <div class="d-flex align-center text-high-emphasis pa-2">
          <VIcon class="me-2" icon="tabler-trash" size="22" />
          <div class="text-base">Delete Contact</div>
        </div>
        <div class="d-flex align-center text-high-emphasis pa-2">
          <VIcon icon="tabler-ban" class="me-2" size="22" />
          <div class="text-base">Block Contact</div>
        </div>

        <VBtn block color="error" append-icon="tabler-trash" class="mt-6">
          Delete Contact
        </VBtn>
      </div>
    </PerfectScrollbar>
  </template>
</template>
