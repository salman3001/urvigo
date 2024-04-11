<script setup lang="ts">
defineProps<{
  totalReviews: number;
  rating: number;
}>();

const reviewCardData = [
  { rating: 5, value: 124 },
  { rating: 4, value: 40 },
  { rating: 3, value: 12 },
  { rating: 2, value: 7 },
  { rating: 1, value: 2 },
];
</script>

<template>
  <VRow class="match-height">
    <VCol cols="12" md="6">
      <!-- 👉 Total Review Card  -->
      <VCard>
        <VCardText>
          <div class="d-flex gap-6 flex-column flex-sm-row">
            <div>
              <div class="d-flex align-center gap-x-2">
                <h3 class="text-h3 text-primary">{{ rating }}</h3>
                <VIcon icon="tabler-star-filled" color="primary" size="32" />
              </div>
              <h6 class="my-2 text-h6">Total {{ totalReviews }} reviews</h6>
              <div class="mb-2 text-wrap">
                All reviews are from genuine customers
              </div>
              <VChip color="primary" label size="small"> +5 This week </VChip>
            </div>

            <VDivider :vertical="$vuetify.display.smAndUp" />

            <div class="flex-grow-1">
              <div
                v-for="(review, index) in reviewCardData"
                :key="index"
                class="d-flex align-center gap-x-4"
                :class="index !== reviewCardData.length - 1 ? 'mb-3' : ''"
              >
                <div class="text-no-wrap text-sm">{{ review.rating }} Star</div>

                <div class="flex-grow-1" style="min-inline-size: 150px">
                  <VProgressLinear
                    color="primary"
                    height="8"
                    :model-value="(review.value / 185) * 100"
                    rounded
                  />
                </div>

                <div class="text-sm">
                  {{ review.value }}
                </div>
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="6">
      <slot> </slot>
    </VCol>
  </VRow>
</template>
