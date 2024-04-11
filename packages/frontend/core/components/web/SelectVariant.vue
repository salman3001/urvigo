<script setup lang="ts">
import BigNumber from "bignumber.js";

const getImageUrl = useGetImageUrl();

const props = defineProps<{
  variant: IServiceVariant;
  selectedId: number;
}>();

let discount = new BigNumber(0);

if (props.variant.discount_type === DiscountType.FLAT) {
  discount = discount.plus(props.variant.discount_flat);
} else if (props.variant.discount_type === DiscountType.PERCENATAGE) {
  discount = new BigNumber(props.variant.discount_percentage)
    .div(100)
    .times(props.variant.price);
}

const qty = ref(1);

const incrementQty = () => {
  qty.value += 1;
};

const decrementQty = () => {
  if (qty.value > 1) {
    qty.value -= 1;
  }
};
</script>

<template>
  <VCard>
    <div
      class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column flex-md-row"
    >
      <div class="ma-auto pa-2">
        <VImg
          :width="250"
          aspect-ratio="16/9"
          cover
          :src="getImageUrl(variant.image?.breakpoints?.thumbnail?.url)"
        />
      </div>

      <VDivider :vertical="$vuetify.display.mdAndUp" />

      <div class="flex-grow-1">
        <VCardItem>
          <VCardTitle>{{ variant?.name }} </VCardTitle>
          <VChip
            color="error"
            v-if="
              discount.gt(0) &&
              variant.discount_type === DiscountType.PERCENATAGE
            "
            >{{ new BigNumber(variant.discount_percentage).toFixed(0) }}%
            off</VChip
          >

          <VChip
            color="error"
            v-if="discount.gt(0) && variant.discount_type === DiscountType.FLAT"
            >&#x20B9;{{ variant.discount_flat }} off</VChip
          >
        </VCardItem>

        <VCardText>
          {{ variant.desc }}
        </VCardText>

        <VCardText class="text-subtitle-1">
          <span>Price :</span>
          <span class="font-weight-medium"
            >&#x20B9;{{
              new BigNumber(variant?.price).minus(discount).toFixed(2)
            }}</span
          >
        </VCardText>

        <VCardActions class="justify-space-between">
          <VBtn :to="routes.bookings.book_now(variant.id)">
            <VIcon icon="tabler-shopping-cart-plus" />
            <span class="ms-2">Book Now</span>
          </VBtn>

          <IconBtn color="secondary" icon="tabler-share" />
        </VCardActions>
      </div>
    </div>
  </VCard>
</template>
