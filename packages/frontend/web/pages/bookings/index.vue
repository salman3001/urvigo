<script setup lang="ts">
// import masterCardDark from "@images/icons/payments/img/master-dark.png";
// import masterCardLight from "@images/icons/payments/img/mastercard.png";
// import paypalDark from "@images/icons/payments/img/paypal-dark.png";
// import paypalLight from "@images/icons/payments/img/paypal-light.png";

// const mastercard = useGenerateImageVariant(masterCardLight, masterCardDark);
// const paypal = useGenerateImageVariant(paypalLight, paypalDark);
const getImageUrl = useGetImageUrl();

const searchQuery = ref("");

// Data table Headers
const headers = [
  { title: "id", key: "id" },
  { title: "Date", key: "created_at" },
  { title: "Service", key: "booking_detail" },
  { title: "Payment", key: "payment_detail", sortable: false },
  { title: "Status", key: "status" },
  { title: "Method", key: "method", sortable: false },
  { title: "Action", key: "actions", sortable: false },
];

const resolveStatus = (status: string) => {
  if (status === OrderStatus.DELIVERED)
    return { text: "Delivered", color: "success" };
  if (status === OrderStatus.PLACED)
    return { text: "Placed", color: "warning" };
  if (status === OrderStatus.CONFIRMED)
    return { text: "Confirmed", color: "secondary" };
  if (status === OrderStatus.REJECTED)
    return { text: "Rejected", color: "error" };
  if (status === OrderStatus.CANCELED)
    return { text: "Canceled", color: "error" };
};

const resolvePaymentStatus = (status: string) => {
  if (status === "paid") return { text: "Paid", color: "success" };
  if (status === "pending") return { text: "Pending", color: "warning" };
};

const { customerBookings, query } = useBookingApi.customerBookings({
  perPage: 20,
  page: 1,
  orderBy: "created_at:desc",
  search: "",
});
const { data: bookings, pending } = await useAsyncData(
  async () => {
    const res = await customerBookings();
    return res.data;
  },
  {
    watch: [query],
  },
);

// const updateOptions = (options: any) => {
//   sortBy.value = options.sortBy[0]?.key;
//   orderBy.value = options.sortBy[0]?.order;
// };
</script>

<template>
  <br />
  <br />
  <br />
  <br />
  <br />
  <VContainer>
    <div>
      <VCard>
        <!-- 👉 Filters -->
        <VCardText>
          <div
            class="d-flex justify-sm-space-between justify-start flex-wrap gap-4"
          >
            <AppTextField
              v-model="searchQuery"
              placeholder="Search Booking"
              style="max-inline-size: 200px; min-inline-size: 200px"
            />

            <div class="d-flex gap-x-4 align-center">
              <AppSelect
                v-model="query.perPage"
                style="min-inline-size: 6.25rem"
                :items="[5, 10, 20, 50, 100]"
              />
              <!-- <VBtn
              variant="tonal"
              color="secondary"
              prepend-icon="tabler-upload"
              text="Export"
            /> -->
            </div>
          </div>
        </VCardText>

        <VDivider />

        <!-- 👉 Order Table -->
        <VDataTableServer
          v-model:items-per-page="query.perPage!"
          v-model:page="query.page"
          :headers="headers"
          :items="bookings?.data"
          item-value="order"
          :items-length="bookings?.meta.total!"
          show-select
          class="text-no-wrap"
        >
          <!-- Order ID -->
          <template #item.id="{ item }">
            <NuxtLink :to="routes.bookings.view(item.id)">
              #{{ item.id }}
            </NuxtLink>
          </template>

          <!-- Date -->
          <template #item.created_at="{ item }">
            {{ new Date(item.created_at).toDateString() }}
          </template>

          <!-- Customers  -->
          <template #item.booking_detail="{ item }">
            <div class="d-flex align-center gap-x-3">
              <VAvatar
                size="34"
                :color="
                  item?.booking_detail?.service_variant.image?.breakpoints
                    ?.thumbnail?.url
                    ? 'primary'
                    : ''
                "
                :variant="'tonal'"
              >
                <VImg
                  :src="
                    getImageUrl(
                      item?.booking_detail?.service_variant.image?.breakpoints
                        ?.thumbnail?.url,
                    )
                  "
                />
              </VAvatar>

              <div class="d-flex flex-column">
                <div class="text-body-1 font-weight-medium">
                  <NuxtLink
                    :to="
                      routes.services.view(
                        item.booking_detail?.service_variant
                          .service_id as unknown as string,
                      )
                    "
                    class="text-link"
                  >
                    {{ item.booking_detail?.service_variant.name }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </template>

          <!-- Payments -->
          <template #item.payment_detail="{ item }">
            <div
              :class="`text-${resolvePaymentStatus(item.payment_detail?.paymentStatus)?.color}`"
              class="font-weight-medium d-flex align-center gap-x-2"
            >
              <VIcon icon="tabler-circle-filled" size="10" />
              <div style="line-height: 22px">
                {{
                  resolvePaymentStatus(item?.payment_detail?.paymentStatus)
                    ?.text
                }}
              </div>
            </div>
          </template>

          <!-- Status -->
          <template #item.status="{ item }">
            <VChip v-bind="resolveStatus(item.status)" label size="small" />
          </template>

          <!-- Method -->
          <!-- <template #item.method="{ item }">
          <div class="d-flex align-center">
            <img
              :src="item.method === 'mastercard' ? mastercard : paypal"
              height="18"
            />
            <div class="text-body-1">
              ...{{
                item.method === "mastercard" ? item.methodNumber : "@gmail.com"
              }}
            </div>
          </div>
        </template> -->

          <!-- Actions -->
          <template #item.actions="{ item }">
            <IconBtn>
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <VListItem value="view" :to="routes.bookings.view(item.id)">
                    View
                  </VListItem>
                </VList>
              </VMenu>
            </IconBtn>
          </template>

          <!-- pagination -->
          <template #bottom>
            <TablePagination
              :page="Number(query.page)"
              :items-per-page="Number(bookings?.meta?.per_page)"
              :total-items="Number(bookings?.meta?.total)"
              @update:page="
                (p) => {
                  query.page = p;
                }
              "
            />
          </template>
        </VDataTableServer>
      </VCard>
    </div>
  </VContainer>
  <br />
  <br />
</template>

<style lang="scss" scoped>
.customer-title:hover {
  color: rgba(var(--v-theme-primary)) !important;
}

.product-widget {
  border-block-end: 1px solid
    rgba(var(--v-theme-on-surface), var(--v-border-opacity));
  padding-block-end: 1rem;
}
</style>
