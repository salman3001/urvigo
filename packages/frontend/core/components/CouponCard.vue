<script setup lang="ts">
import BigNumber from "bignumber.js";

defineProps<{
  coupon: ICoupon;
}>();
</script>

<template>
  <VCard :color="'primary'" hover class="cursor-pointer">
    <VCardItem>
      <p>{{ coupon.name }}</p>
      <p v-if="coupon.discount_type == 'percentage'">
        {{ new BigNumber(coupon.discount_percentage).toFixed() }}% off
      </p>
      <p v-if="coupon.discount_type == 'flat'" class="text-h6">
        &#8377;{{ coupon.discount_flat }} flat off
      </p>
    </VCardItem>
  </VCard>
</template>
