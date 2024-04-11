<script setup lang="ts">
import emptyCartImg from "@images/pages/empty-cart.png";
import BigNumber from "bignumber.js";

interface Props {
  variant: IServiceVariant;
}

const step = defineModel<number>("step", { required: true });
const qty = defineModel<number>("qty", { required: true });
const props = defineProps<Props>();
const getImageUrl = useGetImageUrl();

const nextStep = () => {
  step.value = step.value + 1;
};

let discount = new BigNumber(0);

if (props.variant.discount_type === DiscountType.FLAT) {
  discount = discount.plus(props.variant.discount_flat);
} else if (props.variant.discount_type === DiscountType.PERCENATAGE) {
  discount = new BigNumber(props.variant.discount_percentage)
    .div(100)
    .times(props.variant.price);
}

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
  <VRow>
    <VCol cols="12" lg="8">
      <!-- 👉 Offers alert -->
      <VAlert
        type="success"
        variant="tonal"
        icon="tabler-percentage"
        title="Available Offer"
        closable
      >
        <template #text>
          <p class="mb-0">
            - 0% Instant Discount on Bank of America Corp Bank Debit and Credit
            cards
            <br />
            - 50% Cashback Voucher of up to $60 on first ever PayPal
            transaction. TCA
          </p>
        </template>
      </VAlert>

      <h5 class="text-h5 my-4">My Shopping Bag 1 Items</h5>

      <!-- 👉 Cart items -->
      <div class="border rounded" v-if="variant">
        <template>
          <div
            class="d-flex align-center gap-4 pa-6 position-relative flex-column flex-sm-row flex-grow-1"
          >
            <IconBtn class="checkout-item-remove-btn" @click="() => {}">
              <VIcon size="18" icon="tabler-x" class="text-disabled" />
            </IconBtn>

            <div>
              <VImg
                width="140"
                :src="getImageUrl(variant?.image?.breakpoints?.thumbnail?.url)"
              />
            </div>

            <div class="d-flex w-100 flex-column flex-md-row flex-grow-1">
              <div class="d-flex flex-column gap-y-2">
                <h6 class="text-h6">
                  {{ variant.name }}
                </h6>
                <div class="d-flex align-center text-no-wrap gap-4 text-body-1">
                  <div class="text-disabled">
                    Sold by:
                    <span class="d-inline-block text-primary">
                      {{ variant?.service?.name }}</span
                    >
                  </div>
                  <VChip :color="'success'" label size="small">
                    Avilable
                  </VChip>
                </div>

                <VRating
                  density="compact"
                  :model-value="variant.service.avg_rating"
                  size="24"
                  readonly
                />
                <div>
                  <IconBtn
                    color="secondary"
                    icon="tabler-minus"
                    @click="decrementQty"
                  />
                  {{ qty }}
                  <IconBtn
                    color="secondary"
                    icon="tabler-plus"
                    @click="incrementQty"
                  />
                </div>
              </div>

              <VSpacer />

              <div
                class="d-flex flex-column mt-5 text-start text-md-end"
                :class="$vuetify.display.mdAndDown ? 'gap-2' : 'gap-4'"
              >
                <div class="d-flex text-base align-self-md-end">
                  <div class="text-primary">&#x20B9;{{ variant.price }}</div>
                  <div v-if="discount.gt(0)">/</div>
                  <div
                    v-if="discount.gt(0)"
                    class="text-decoration-line-through"
                  >
                    &#x20B9;{{
                      new BigNumber(variant.price).minus(discount).toFixed(2)
                    }}
                  </div>
                </div>

                <div>
                  <VBtn variant="tonal" size="small"> add to wishlist </VBtn>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- 👉 Empty Cart -->
      <div v-else>
        <VImg :src="emptyCartImg" />
      </div>

      <!-- 👉 Add more from wishlist -->
      <div
        class="d-flex align-center justify-space-between rounded py-2 px-5 text-base mt-4"
        style="border: 1px solid rgb(var(--v-theme-primary))"
      >
        <a href="#" class="font-weight-medium"
          >Add more products from wishlist</a
        >
        <VIcon
          icon="tabler-arrow-right"
          size="16"
          class="flip-in-rtl text-primary"
        />
      </div>
    </VCol>

    <VCol cols="12" lg="4">
      <VCard flat variant="outlined">
        <!-- 👉 Price details -->
        <VCardText>
          <h6 class="text-h6 mb-4">Price Details</h6>

          <div class="text-high-emphasis">
            <div class="d-flex justify-space-between mb-2">
              <span>Bag Total</span>
              <span class="text-medium-emphasis"
                >&#x20B9;{{ new BigNumber(variant.price).times(qty) }}</span
              >
            </div>

            <div class="d-flex justify-space-between mb-2">
              <span>Discount</span>
              &#x20B9;{{ discount.toFixed(2) }}
            </div>

            <div class="d-flex justify-space-between mb-2">
              <span>Coupon Discount</span>
              <a href="#">Apply Coupon</a>
            </div>

            <div class="d-flex justify-space-between mb-2">
              <span>Order Total</span>
              <span class="text-medium-emphasis"
                >&#x20B9;{{
                  new BigNumber(variant.price).times(qty).minus(discount)
                }}</span
              >
            </div>

            <div class="d-flex justify-space-between">
              <span>Delivery Charges</span>

              <div class="d-flex align-center">
                <div class="text-decoration-line-through text-disabled me-2">
                  &#x20B9;5.00
                </div>
                <VChip size="small" color="success"> FREE </VChip>
              </div>
            </div>
          </div>
        </VCardText>

        <VDivider />

        <!-- <VCardText class="d-flex justify-space-between pa-6">
          <h6 class="text-h6">Total</h6>
          <h6 class="text-h6">${{ totalCost }}.00</h6>
        </VCardText> -->
      </VCard>

      <VBtn block class="mt-4" @click="nextStep">Proceed</VBtn>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.checkout-item-remove-btn {
  position: absolute;
  inset-block-start: 14px;
  inset-inline-end: 14px;
}
</style>
