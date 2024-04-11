<script setup lang="ts">
import useGetImageUrl from "@/composables/useGetImageUrl";
import BigNumber from "bignumber.js";

const props = defineProps<{
  service: IService;
}>();

const getImageUrl = useGetImageUrl();

const minPriceVariant = props.service.variants.reduce((prev, current) =>
  prev.price < current.price ? prev : current,
);

let discount = new BigNumber(0);

if (minPriceVariant.discount_type === DiscountType.FLAT) {
  discount = discount.plus(minPriceVariant?.discount_flat || 0);
} else if (minPriceVariant?.discount_type === DiscountType.PERCENATAGE) {
  discount = new BigNumber(minPriceVariant?.discount_percentage || 0)
    .div(100)
    .times(minPriceVariant.price);
}
</script>

<template>
  <VCard class="ma-0" :to="routes.services.view(service?.slug)">
    <VImg
      :src="getImageUrl(service?.thumbnail?.breakpoints?.thumbnail?.url)"
      cover
    />

    <VCardItem>
      <VCardTitle>{{ service.name }}</VCardTitle>
    </VCardItem>

    <VCardText>
      <p class="line-clamp-3">
        {{ service?.short_desc }}
      </p>
    </VCardText>

    <VCardText class="text-subtitle-1">
      <span>
        <span>
          <VChip
            color="error"
            v-if="
              discount.gt(0) &&
              minPriceVariant.discount_type === DiscountType.FLAT
            "
            >&#x20B9;{{ minPriceVariant.discount_flat }} off</VChip
          >
          <VChip
            color="error"
            v-if="
              discount.gt(0) &&
              minPriceVariant.discount_type === DiscountType.PERCENATAGE
            "
            >{{ minPriceVariant.discount_percentage }}% off</VChip
          >
        </span>
      </span>
      <span class="font-weight-medium">
        <div class="d-flex justify-between">
          <div class="">
            <span>
              {{ service.variants?.length ? 1 && "Starting From" : "" }}</span
            ><span class="text-bold text-h6">
              &#x20B9;{{
                service.variants?.length > 1
                  ? service?.meta?.starting_from
                  : service?.variants[0]?.price
              }}</span
            >
          </div>
        </div>
      </span>
    </VCardText>
    <VCardActions class="align-center justify-space-between">
      <VBtn>
        <VIcon icon="tabler-star-filled" color="primary" size="22" />
        &nbsp;
        <span
          >{{ service.avg_rating }} |
          {{ service?.meta?.reviews_count }} Reviews</span
        >
      </VBtn>

      <IconBtn color="secondary" icon="tabler-share" />
    </VCardActions>
  </VCard>
</template>

<style lang="scss" scoped>
.v-btn {
  transform: none;
}
</style>
