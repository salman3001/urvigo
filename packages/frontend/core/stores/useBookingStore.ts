import { defineStore } from "pinia";
import { ref } from "vue";

const useBookingStore = defineStore("useBookingStore", () => {
  const loadingSummary = ref(false);
  const creatingBooking = ref(false);
  const customFetch = useCustomFetch();
  const summary = ref<IBookingSummary | null>(null);
  const couponId = ref(0);

  const getSummary = async (
    variantId: number,
    qty: number,
    onSuccess?: () => void
  ) => {
    loadingSummary.value = true;
    try {
      const data = await customFetch<IResType<IBookingSummary>>(
        apiRoutes.bookings.summary,
        {
          method: "post",
          body: {
            serviceVariantId: variantId,
            qty: qty,
            couponId: couponId.value,
          },
        }
      );

      if (data.success == true) {
        summary.value = data.data;
        onSuccess && onSuccess();
      }
    } catch (error) {
      console.log(error);
    }
    loadingSummary.value = false;
  };

  const create_booking = async (
    body: {
      serviceVariantId: number;
      qty: number;
      couponId: number | undefined;
      paymentdetail: {
        paymentMode: string;
        paymentStatus: string;
      };
    },
    onSuccess?: () => void
  ) => {
    creatingBooking.value = true;
    try {
      const data = await customFetch<IResType<IBookingSummary>>(
        apiRoutes.bookings.create,
        {
          method: "post",
          body,
        }
      );

      if (data.success == true) {
        onSuccess && onSuccess();
      }
    } catch (error) {
      console.log(error);
    }
    creatingBooking.value = false;
  };

  return {
    getSummary,
    create_booking,
    couponId,
    loadingSummary,
    summary,
    creatingBooking,
  };
});

export default useBookingStore;
