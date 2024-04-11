<script setup lang="ts">
import BigNumber from "bignumber.js";
const qty = ref(1);

const incrementQty = () => {
  qty.value += 1;
};

const decrementQty = () => {
  if (qty.value > 1) {
    qty.value -= 1;
  }
};

const props = defineProps<{
  selectedVariant: IServiceVariant;
}>();

let discount = ref(new BigNumber(0));

watch(
  () => props.selectedVariant,
  () => {
    discount.value = new BigNumber(0);
    if (props.selectedVariant?.discount_type === DiscountType.FLAT) {
      discount.value = discount.value.plus(
        props.selectedVariant?.discount_flat || 0,
      );
    } else if (
      props.selectedVariant?.discount_type === DiscountType.PERCENATAGE
    ) {
      discount.value = new BigNumber(
        props.selectedVariant?.discount_percentage || 0,
      )
        .div(100)
        .times(props.selectedVariant.price);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div>
    <div v-if="selectedVariant" class="column q-col-gutter-lg">
      <div class="q-mt-xs q-gutter-x-lg row items-center">
        <div class="line-through text-subtitle2" v-if="discount.gt(0)">
          &#x20B9;{{
            new BigNumber(selectedVariant?.price).times(qty).toFixed(2)
          }}
        </div>
        <div class="text-bold text-h5">
          &#x20B9;{{
            new BigNumber(selectedVariant?.price)
              .minus(discount)
              .times(qty)
              .toFixed(2)
          }}
        </div>
        <div class="text-h6 row items-center q-gutter-xs">
          <span> Qty. </span>
          <q-btn
            size="xs"
            outline
            icon="remove"
            round
            color="primary"
            @click="decrementQty"
          />
          <span>{{ qty }}</span>
          <q-btn
            size="xs"
            outline
            icon="add"
            round
            color="primary"
            @click="incrementQty"
          />
        </div>
      </div>
      <div class="text-h5">
        <NuxtLink
          :to="{
            path: routes.bookings.book_now(selectedVariant.id),
            query: { qty: qty },
          }"
        >
          <q-btn class="full-width" color="primary" size="lg">Book Now</q-btn>
        </NuxtLink>
      </div>
    </div>
    <div v-else>Price Upon variant selection</div>
  </div>
</template>
