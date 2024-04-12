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
          <VCardTitle>{{ requirement.title }}</VCardTitle>
        </VCardItem>

        <VCardText>
          {{ requirement.desc }}
        </VCardText>

        <VCardItem>
          <div class="d-flex flex-wrap justify-space-between gap-3">
            <div class="d-flex flex-column gap-2">
              <div v-if="requirement.urgent">
                <VChip color="error">Urgent Requirment</VChip>
              </div>
              <div>
                <VChip color="success" v-if="!requirement.accepted_bid_id"
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
              <div>
                <VIcon icon="tabler-map-pin"></VIcon>
                Jarkhand, India
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
          <p
            v-for="(tag, i) in requirement.tags"
            :key="i"
            class="normalcase flex-grow-1 pa-2"
          >
            #{{ tag.name }}
          </p>

          <VDivider v-if="$vuetify.display.smAndUp" vertical inset />

          <div class="d-flex flex-wrap justify-end gap-2 pa-2 flex-grow-1">
            <VChip color="info"
              ><VIcon icon="tabler-message" />&nbsp; Bids
              <span>{{ requirement?.meta?.recievedBids_count }}</span></VChip
            >
            <VChip color="success">
              <VIcon icon="tabler-moneybag" /> &nbsp;Avg. Price
              <span>
                &nbsp; &#x20B9;
                {{
                  new BigNumber(requirement.meta?.avgBidPrice || 0).toFixed(2)
                }}</span
              >
            </VChip>
            <VChip color="warning"
              ><VIcon icon="tabler-circle-check" />&nbsp;Accepted Bid
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
