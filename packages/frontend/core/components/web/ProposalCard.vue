<script setup lang="ts">
import BigNumber from "bignumber.js";
import dummyThumb from "@images/dummy-avatar.webp";
defineProps<{
  accepted: boolean;
  bid: IBid;
}>();

const emit = defineEmits<{
  (e: "review", bid: IBid): void;
  (e: "negotiate", bid: IBid): void;
  (e: "create-chat"): void;
}>();

const getImageUrl = useGetImageUrl();
</script>

<template>
  <VCard
    bordered
    :class="accepted ? 'border-primary border-2' : ''"
    style="max-width: 450px; height: max-content"
  >
    <VCardItem>
      <div class="fd-lex gap-2 flex-wrap justify-space-between">
        <div class="d-flex gap-6">
          <VAvatar
            size="x-large"
            :image="
              getImageUrl(bid?.vendorUser?.profile?.avatar?.url, dummyThumb)
            "
          />
          <div>
            <div>
              <RatingComponent
                :rating="bid?.vendorUser?.avg_rating || 0"
                size="small"
              />
            </div>
            <p v-if="accepted">
              {{ bid?.vendorUser.first_name }}
              {{ bid?.vendorUser.last_name }}
              <VBtn color="primary" @click="emit('create-chat')">chat</VBtn>
            </p>
            <p v-else>Anonymous</p>
            <div>
              <NuxtLink
                :to="routes.vendor_profile.view(bid.vendorUser.id)"
                class="underline"
                >{{ bid?.vendorUser?.business_name }}</NuxtLink
              >
            </div>
          </div>
        </div>
        <div>
          <p class="text-caption">
            {{ new Date(bid?.created_at).toDateString() }}
          </p>
          <VChip v-if="accepted" color="success"> Accepted</VChip>
        </div>
      </div>
      <br />
      <div class="gap-2">
        <VChip color="primary">
          &#x20B9;{{ new BigNumber(bid?.offered_price || 0).toFixed(2) }}</VChip
        >
      </div>
      <br />
      <div>
        <p class="text-body-1 line-clamp-3">
          {{ bid?.message }}
        </p>
      </div>
    </VCardItem>
    <VDivider />
    <VCardActions class="row q-gutter-sm q-px-sm justify-end">
      <VBtn color="primary" @click="emit('review', bid)">Review</VBtn>
    </VCardActions>
    <br />
  </VCard>
</template>
