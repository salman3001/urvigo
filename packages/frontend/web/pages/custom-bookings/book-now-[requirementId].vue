<script setup lang="ts">
import customAddress from "@images/svg/address.svg";
import customCart from "@images/svg/cart.svg";
import customPayment from "@images/svg/payment.svg";
import customTrending from "@images/svg/trending.svg";

definePageMeta({
  middleware: "is-logged-in",
});
const route = useRoute();

const currentStep = ref(0);
const isActiveStepValid = ref(true);

const {
  create: creatBooking,
  form,
  loading,
  errors,
} = useBidBookingApi.cretae();

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
  form.serviceRequirementId = route.params.requirementId;
  form.acceptedBidId = route?.query?.acceptedBidId;
  form.paymentdetail.paymentMode = "online";
  form.paymentdetail.paymentStatus = "paid";
  const res = await creatBooking();

  if (res?.success == true) {
    currentStep.value += 1;
  }
};

const { show } = useServiceRequirementApi.show();
const { show: showBid } = useBidApi.show();

const { data } = await useAsyncData(async () => {
  const [requirement, acceptedBid] = await Promise.all([
    show(route?.params?.requirementId as unknown as number),
    showBid(route?.query?.acceptedBidId as unknown as number),
  ]);

  return { requirement: requirement.data, acceptedBid: acceptedBid.data };
});
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
          <ViewsWebCustombookingCart
            v-model:qty="form.qty"
            v-model:step="currentStep"
            :service-requirement="data?.requirement"
            :accepted-bid="data?.acceptedBid!"
          />
        </VWindowItem>

        <VWindowItem>
          <ViewsWebCustombookingAddress
            :service-requirement="data?.requirement!"
            :accepted-bid="data?.acceptedBid!"
            :qty="form.qty"
            v-model:step="currentStep"
          />
        </VWindowItem>

        <VWindowItem>
          <ViewsWebCustombookingPayment
            v-model:step="currentStep"
            :service-requirement="data?.requirement!"
            :accepted-bid="data?.acceptedBid!"
            :qty="form.qty"
            @paid="submit"
          />
        </VWindowItem>

        <VWindowItem>
          <ViewsWebCheckoutConfirmation />
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
  <br />
  <br />
  <br />
</template>
