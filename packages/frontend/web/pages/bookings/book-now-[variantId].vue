<script setup lang="ts">
import googleHome from "@images/pages/google-home.png";
import iphone11 from "@images/pages/iphone-11.png";
import customAddress from "@images/svg/address.svg";
import customCart from "@images/svg/cart.svg";
import customPayment from "@images/svg/payment.svg";
import customTrending from "@images/svg/trending.svg";

definePageMeta({
  middleware: "is-logged-in",
});
const route = useRoute();
const qty = ref(1);
const { show } = useServiceVariantApi.show();
const { data: variant, pending } = await useAsyncData(async () => {
  const data = await show(route?.params?.variantId);
  return data.data;
});

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

const checkoutData = ref({
  cartItems: [
    {
      id: 1,
      name: "Google - Google Home - White",
      seller: "Google",
      inStock: true,
      rating: 4,
      price: 299,
      discountPrice: 359,
      image: googleHome,
      quantity: 1,
      estimatedDelivery: "18th Nov 2021",
    },
    {
      id: 2,
      name: "Apple iPhone 11 (64GB, Black)",
      seller: "Apple",
      inStock: true,
      rating: 4,
      price: 899,
      discountPrice: 999,
      image: iphone11,
      quantity: 1,
      estimatedDelivery: "20th Nov 2021",
    },
  ],
  promoCode: "",
  orderAmount: 1198,
  deliveryAddress: "home",
  deliverySpeed: "free",
  deliveryCharges: 0,
  addresses: [
    {
      title: "John Doe (Default)",
      desc: "4135 Parkway Street, Los Angeles, CA, 90017",
      subtitle: "1234567890",
      value: "home",
    },
    {
      title: "ACME Inc.",
      desc: "87 Hoffman Avenue, New York, NY, 10016",
      subtitle: "1234567890",
      value: "office",
    },
  ],
});

const currentStep = ref(0);
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
            v-if="!pending"
            v-model:qty="qty"
            v-model:step="currentStep"
            :variant="variant"
          />
          <VSkeletonLoader v-else type="card" />
        </VWindowItem>

        <VWindowItem>
          <ViewsWebCheckoutAddress
            v-model:current-step="currentStep"
            v-model:checkout-data="checkoutData"
          />
        </VWindowItem>

        <VWindowItem>
          <ViewsWebCheckoutPayment
            v-model:current-step="currentStep"
            v-model:checkout-data="checkoutData"
          />
        </VWindowItem>

        <VWindowItem>
          <ViewsWebCheckoutConfirmation v-model:checkout-data="checkoutData" />
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
  <br />
  <br />
  <br />
</template>
