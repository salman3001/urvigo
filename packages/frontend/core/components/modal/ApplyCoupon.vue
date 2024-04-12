<script setup lang="ts">
const props = defineProps<{
  variantId: number;
}>();

const isVisible = defineModel<boolean>("isVisible");

const { couponList } = useBookingApi.couponList();
const { data, pending } = await useAsyncData(async () => {
  const res = await couponList(props.variantId);
  return res.data;
});

const emit = defineEmits<{
  (e: "apply", couponId: number): void;
}>();
</script>

<template>
  <ModalBase
    v-model:is-visible="isVisible"
    title="Apply Coupon"
    subtitle="Please select oone from available coupons"
  >
    <VCardItem>
      <VRow>
        <VCol cols="2" sm="6" v-for="(c, i) in data" :key="i">
          <CouponCard :coupon="c" @click="$emit('apply', c.id)" />
        </VCol>
      </VRow>
    </VCardItem>
  </ModalBase>
</template>
