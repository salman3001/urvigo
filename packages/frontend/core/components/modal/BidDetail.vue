<script setup lang="ts">
import dummyAvatar from "@images/dummy-avatar.webp";
import BigNumber from "bignumber.js";

const props = defineProps<{
  selectedBid: IBid;
  acceptedBid: IBid;
  serviceRequirement: IServiceRequirement;
}>();

const emit = defineEmits<{
  (e: "createChat"): void;
  (e: "negotiated"): void;
}>();

const model = defineModel<boolean>({ required: true });
const negotiateModal = ref(false);

const getImageUrl = useGetImageUrl();

const {
  create: negotiate,
  form: negotiateForm,
  loading: negotiateOnProgress,
} = useServiceRequirementApi.negotiate();
</script>

<template>
  <ModalBase v-model:is-visible="model" title="" subtitle="">
    <VCardItem v-if="selectedBid">
      <div class="d-flex gap-2 flex-wrap justify-space-between">
        <div class="d-flex gap-2">
          <VAvatar
            :image="
              getImageUrl(
                selectedBid?.vendorUser?.profile?.avatar?.url,
                dummyAvatar,
              )
            "
            size="x-large"
          />
          <div>
            <div>
              <RatingComponent
                :rating="selectedBid?.vendorUser?.avg_rating || 0"
                size="large"
              />
            </div>
            <p v-if="acceptedBid?.id === selectedBid?.id">
              {{ selectedBid?.vendorUser.first_name }}
              {{ selectedBid?.vendorUser.last_name }}
              <VBtn
                size="xs"
                color="secondary"
                v-if="acceptedBid?.id === selectedBid?.id"
                @click="() => emit('createChat')"
                >chat</VBtn
              >
            </p>
            <p v-else>Anonymous</p>
            <div>
              <NuxtLink
                :to="routes.vendor_profile.view(selectedBid?.vendor_user_id)"
                >{{ selectedBid?.vendorUser?.business_name }}</NuxtLink
              >
            </div>
          </div>
        </div>
        <div>
          <p class="text-caption">
            {{ new Date(selectedBid?.created_at).toDateString() }}
          </p>
          <VChip
            v-if="acceptedBid?.id === selectedBid?.id"
            outline
            color="success"
          >
            Accepted</VChip
          >
        </div>
      </div>
      <br />
      <div>
        Price Offered
        <span class="font-weight-bold"
          >&#x20B9;{{
            new BigNumber(selectedBid?.offered_price || 0).toFixed(2)
          }}</span
        >
      </div>
      <br />
      <div>
        <p>
          {{ selectedBid?.message }}
        </p>
      </div>
      <br />
      <div v-if="selectedBid?.negotiate_history.length">
        <h4 class="text-bold">Negotiation History</h4>
        <br />
        <VTimeline
          truncate-line="both"
          line-inset="9"
          align="start"
          side="end"
          line-color="primary"
          density="compact"
        >
          <VTimelineItem
            v-for="(h, i) in selectedBid?.negotiate_history"
            :key="i"
            dot-color="primary"
            size="x-small"
          >
            <div class="d-flex justify-space-between align-center">
              <div class="app-timeline-title">
                You Offered {{ h.asked_price }}
              </div>
              <div class="app-timeline-meta">
                {{ new Date(h?.date_time).toDateString() }}
              </div>
            </div>
            <p class="app-timeline-text mb-1 mt-1">
              {{ h.message }}
            </p>
            <div v-if="!h.accepted">
              <VChip color="warning">Pending</VChip>
            </div>
            <div v-else>
              <VChip color="success">Accepted</VChip>
            </div>
          </VTimelineItem>
        </VTimeline>
        <!-- <TimeLine>
          <template v-for="(h, i) in selectedBid?.negotiate_history" :key="i">
            <q-timeline-entry>
              <template v-slot:title>
                You offered
                <span class="text-bold">&#x20B9;{{ h.asked_price }}</span>
              </template>

              <template v-slot:subtitle>
                {{ new Date(h?.date_time).toDateString() }}
              </template>

              <div class="text-muted">
                <span class="text-bold text-nutral">You Said :</span>
                {{ h.message }}
              </div>
              <div v-if="!h.accepted">
                <VChip class="VChip-warning q-pa-sm">Pending</VChip>
              </div>
              <div v-else>
                <VChip class="VChip-positive q-pa-sm">Negotiated</VChip>
              </div>
            </q-timeline-entry>
          </template>
        </TimeLine> -->
      </div>
    </VCardItem>
    <VCardItem v-if="selectedBid && !acceptedBid">
      <div class="d-flex justify-end gap-2">
        <VBtn
          variant="tonal"
          color="primary"
          @click.prevent="negotiateModal = true"
          v-if="
            !selectedBid?.negotiate_history?.length ||
            selectedBid?.negotiate_history[
              selectedBid?.negotiate_history?.length - 1
            ]?.accepted
          "
          >Negotiate</VBtn
        >
        <VBtn
          v-if="!serviceRequirement.accepted_bid_id"
          color="primary"
          :to="{
            path: routes.custom_bookings.book_now(serviceRequirement.id),
            query: {
              acceptedBidId: selectedBid.id,
            },
          }"
          >Accept and Book</VBtn
        >
      </div>
    </VCardItem>
    <ModalBidNegotiate
      v-model="negotiateModal"
      :selected-bid="selectedBid"
      :service-requirement="serviceRequirement"
      @negotiated="
        () => {
          negotiateModal = false;
          emit('negotiated');
        }
      "
    />
  </ModalBase>
</template>
