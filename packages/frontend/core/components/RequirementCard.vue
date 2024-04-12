<script setup lang="ts">
import BigNumber from "bignumber.js";
import { differenceInMinutes } from "date-fns";

defineProps<{
  requirement: IServiceRequirement;
}>();

const route = useRoute();

const getImageUrls = useGetImageUrl();
</script>

<template>
  <VCard>
    <VRow no-gutters>
      <VCol>
        <VCardItem>
          <VCardTitle
            ><h3>{{ requirement.title }}</h3></VCardTitle
          >
        </VCardItem>

        <VCardText>
          {{ requirement.desc }}
        </VCardText>
        <VCardItem v-if="requirement?.images">
          <h3>Images</h3>
          <br />
          <LightBox
            :images="requirement.images.map((i) => getImageUrls(i?.file?.url))"
          />
        </VCardItem>

        <VCardItem>
          <div
            class="d-flex flex-wrap justify-space-between gap-3 text-caption"
          >
            <div class="d-flex flex-column gap-2">
              <div>
                <VIcon icon="tabler-map-pin"></VIcon>
                Jarkhand, India
              </div>
              <div class="d-flex gap-2">
                <VChip v-if="requirement.urgent" color="error"
                  >Urgent Requirment</VChip
                >
                <VChip color="warning" v-if="!requirement.accepted_bid_id"
                  >Active</VChip
                >
                <VChip
                  v-else-if="requirement.accepted_bid_id != null"
                  color="success"
                  >Accepted</VChip
                >
                <VChip
                  color="error"
                  v-else-if="
                    differenceInMinutes(requirement.expires_at, Date.now()) < 0
                  "
                  >Expired</VChip
                >
              </div>
            </div>

            <div>
              <ClientOnly>
                <div>
                  Posted on:
                  {{ new Date(requirement.created_at).toDateString() }}
                </div>
                <div>
                  Expired on:
                  {{ new Date(requirement.expires_at).toDateString() }}
                </div>
              </ClientOnly>
            </div>
          </div>
        </VCardItem>

        <VCardText>
          <VDivider />
        </VCardText>

        <VCardText class="d-flex flex-wrap justify-space-between">
          <div class="normalcase d-flex gap-2 flex-grow-1 pa-2">
            <p v-for="(tag, i) in requirement.tags" :key="i">#{{ tag.name }}</p>
          </div>

          <VDivider v-if="$vuetify.display.smAndUp" vertical inset />

          <div class="d-flex flex-wrap justify-end gap-2 pa-2 flex-grow-1">
            <VChip color="secondary"
              ><VIcon icon="tabler-message" />&nbsp; Bids&nbsp;
              <span>{{ requirement?.meta?.recievedBids_count }}</span></VChip
            >
            <VChip color="secondary">
              <VIcon icon="tabler-moneybag" /> &nbsp;Avg. Price
              <span>
                &nbsp; &#x20B9;
                {{
                  new BigNumber(requirement.meta?.avgBidPrice || 0).toFixed(2)
                }}</span
              >
            </VChip>
            <VChip color="secondary"
              ><VIcon icon="tabler-circle-check" />&nbsp;Accepted Bid&nbsp;
              <span> {{ requirement.accepted_bid_id ? 1 : 0 }}</span></VChip
            >
            <NuxtLink
              :to="routes.service_requirement.view(requirement.id)"
              v-if="
                route.fullPath !=
                routes.service_requirement.view(requirement.id)
              "
            >
              <VBtn color="primary"> View Detail </VBtn>
            </NuxtLink>
          </div>
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
</template>
