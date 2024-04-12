<script setup lang="ts">
import customAddress from "@images/svg/address.svg";
import customCart from "@images/svg/cart.svg";
import customPayment from "@images/svg/payment.svg";
import customTrending from "@images/svg/trending.svg";

definePageMeta({
  middleware: "is-logged-in",
});
const route = useRoute();
const applyCouponModal = ref(false);
const { bookingSummary, form } = useBookingApi.bookingSummary();

const currentStep = ref(0);
const isActiveStepValid = ref(true);

const { data: summary, pending } = await useAsyncData(
  async () => {
    form.serviceVariantId = route?.params?.variantId;
    const res = await bookingSummary();
    return res?.data;
  },
  {
    watch: [() => form.qty, () => form.couponId],
  },
);

const {
  create: creatBooking,
  form: bookingForm,
  loading,
  errors,
} = useBookingApi.cretae();

const checkoutSteps = [
  {
    title: "Cart",
    icon: customCart,
  },
  {
    title: "Address",
    icon: customAddress,
  },
  {
    title: "Payment",
    icon: customPayment,
  },
  {
    title: "Confirmation",
    icon: customTrending,
  },
];

const submit = async () => {
  bookingForm.couponId = form.couponId;
  bookingForm.qty = form.qty as unknown as string;
  bookingForm.serviceVariantId = route.params.variantId;
  bookingForm.paymentdetail.paymentMode = "online";
  bookingForm.paymentdetail.paymentStatus = "paid";

  const res = await creatBooking();

  if (res?.success == true) {
    currentStep.value += 1;
  }
};
</script>

<template>
  <br />
  <br />
  <br />
  <br />
  <VCard>
    <VCardText>
      <!-- 👉 Stepper -->
      <AppStepper
        v-model:current-step="currentStep"
        class="checkout-stepper"
        :items="checkoutSteps"
        :direction="$vuetify.display.mdAndUp ? 'horizontal' : 'vertical'"
        :is-active-step-valid="isActiveStepValid"
        align="center"
      />
    </VCardText>

    <VDivider />

    <VCardText>
      <!-- 👉 stepper content -->
      <VWindow
        v-model="currentStep"
        class="disable-tab-transition"
        :touch="false"
      >
        <VWindowItem>
          <ViewsWebCheckoutCart
            v-model:qty="form.qty"
            v-model:step="currentStep"
            :summary="summary!"
            @apply-coupon="() => (applyCouponModal = true)"
          />
        </VWindowItem>

        <VWindowItem>
          <ViewsWebCheckoutAddress
            :summary="summary!"
            v-model:step="currentStep"
          />
        </VWindowItem>

        <VWindowItem>
          <ViewsWebCheckoutPayment
            v-model:step="currentStep"
            :summary="summary!"
            @paid="submit"
          />
        </VWindowItem>

        <VWindowItem>
          <ViewsWebCheckoutConfirmation />
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
  <ModalApplyCoupon
    v-model:is-visible="applyCouponModal"
    :variant-id="route.params?.variantId"
    @apply="
      (couponId) => {
        form.couponId = couponId as unknown as string;
        applyCouponModal = false;
      }
    "
  />
  <br />
  <br />
  <br />
</template>
