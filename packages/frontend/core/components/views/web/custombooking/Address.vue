<script setup lang="ts">
import googleHome from "@images/pages/google-home.png";
import iphone11 from "@images/pages/iphone-11.png";
import BigNumber from "bignumber.js";

interface Props {
  serviceRequirement: IServiceRequirement;
  acceptedBid: IBid;
  qty: number;
}

const step = defineModel<number>("step", { required: true });

defineProps<Props>();

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
const isEditAddressDialogVisible = ref(false);

const deliveryOptions = [
  {
    icon: { icon: "tabler-user" },
    title: "Standard",
    desc: "Get your product in 1 Week.",
    value: "free",
  },
  {
    icon: { icon: "tabler-star" },
    title: "Express",
    desc: "Get your product in 4 days.",
    value: "express",
  },
  {
    icon: { icon: "tabler-crown" },
    title: "Overnight",
    desc: "Get your product in 1 day.",
    value: "overnight",
  },
];

const resolveAddressBadgeColor: any = {
  home: "primary",
  office: "success",
};

const resolveDeliveryBadgeData: any = {
  free: { color: "success", price: "Free" },
  express: { color: "secondary", price: 10 },
  overnight: { color: "secondary", price: 15 },
};
</script>

<template>
  <VRow>
    <VCol cols="12" md="8">
      <!-- 👉 Address options -->
      <h6 class="text-h6 mb-4">Select your preferable address</h6>

      <!-- 👉 Address custom input -->
      <CustomRadios
        v-model:selected-radio="checkoutData.deliveryAddress"
        :radio-content="checkoutData.addresses"
        :grid-column="{ cols: '12', sm: '6' }"
      >
        <template #default="{ item }">
          <div class="w-100">
            <div class="d-flex justify-space-between mb-3">
              <h6 class="text-base font-weight-medium">
                {{ item.title }}
              </h6>

              <VChip
                :color="resolveAddressBadgeColor[item.value]"
                label
                size="small"
                class="text-capitalize"
              >
                {{ item.value }}
              </VChip>
            </div>

            <p class="mb-0 text-sm">
              {{ item.desc }}
            </p>
            <p class="text-sm mb-3">Mobile: {{ item.subtitle }}</p>
            <VDivider />
            <div class="pt-2">
              <a href="#" class="me-4">Edit</a>
              <a href="#">Remove</a>
            </div>
          </div>
        </template>
      </CustomRadios>

      <!-- 👉 Add New Address -->
      <VBtn
        variant="tonal"
        class="mt-4 mb-6"
        @click="isEditAddressDialogVisible = !isEditAddressDialogVisible"
      >
        Add New Address
      </VBtn>

      <!-- 👉 Delivery options -->
      <h6 class="text-h6 mb-4">Choose Delivery Speed</h6>

      <!-- 👉 Delivery options custom input -->
      <CustomRadiosWithIcon
        v-model:selected-radio="checkoutData.deliverySpeed"
        :radio-content="deliveryOptions"
        :grid-column="{ cols: '12', sm: '4' }"
      >
        <template #default="{ item }">
          <div class="d-flex flex-column align-center gap-2 w-100">
            <div class="d-flex justify-end w-100 mb-n3">
              <VChip
                :color="resolveDeliveryBadgeData[item.value].color"
                size="small"
                label
              >
                {{
                  resolveDeliveryBadgeData[item.value].price === "Free"
                    ? resolveDeliveryBadgeData[item.value].price
                    : `$${resolveDeliveryBadgeData[item.value].price}`
                }}
              </VChip>
            </div>

            <VIcon v-bind="item?.icon" size="28" />

            <h6 class="text-h6">
              {{ item.title }}
            </h6>
            <p class="text-sm text-center mb-0">
              {{ item.desc }}
            </p>
          </div>
        </template>
      </CustomRadiosWithIcon>
    </VCol>

    <VCol cols="12" md="4">
      <VCard flat variant="outlined">
        <!-- 👉 Delivery estimate date -->
        <VCardText>
          <h6 class="text-h6 mb-4">Booking Item</h6>

          <VList class="card-list">
            <VListItem>
              <div class="text-body-1">
                {{ serviceRequirement?.name }}
              </div>
              <h6 class="text-h6 text-medium-emphasis">
                &#x20B9; {{ acceptedBid?.offered_price }}
              </h6>
            </VListItem>
          </VList>
        </VCardText>

        <VDivider />

        <!-- 👉 Price details -->
        <VCardText>
          <h6 class="text-h6 mb-4">Price Details</h6>

          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-high-emphasis">Order Total</span>
            <span
              >&#x20B9;{{
                new BigNumber(acceptedBid?.offered_price).times(qty).toFixed(2)
              }}</span
            >
          </div>

          <div class="d-flex align-center justify-space-between">
            <span class="text-high-emphasis">Delivery Charges</span>
            <div class="text-end">
              <div
                v-if="checkoutData.deliverySpeed === 'free'"
                class="d-flex align-center"
              >
                <div class="text-decoration-line-through text-disabled me-2">
                  &#x20B9;5.00
                </div>
                <VChip size="small" color="success"> FREE </VChip>
              </div>
              <span v-else
                >&#x20B9;{{
                  resolveDeliveryBadgeData[checkoutData.deliverySpeed].price
                }}.00</span
              >
            </div>
          </div>
        </VCardText>

        <VDivider />

        <VCardText
          class="d-flex align-center justify-space-between text-high-emphasis"
        >
          <span class="text-base font-weight-medium">Total</span>
          <span class="text-base font-weight-medium">
            &#x20B9;{{
              new BigNumber(acceptedBid?.offered_price).times(qty).toFixed(2)
            }}
          </span>
        </VCardText>
      </VCard>

      <VBtn block class="mt-4" @click="step = step + 1"> Place Order </VBtn>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1rem;
}
</style>
