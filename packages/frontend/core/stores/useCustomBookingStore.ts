import { defineStore } from "pinia";
import { ref } from "vue";

const useBookingStore = defineStore("useCustomBookingStore", () => {
  const creatingBooking = ref(false);
  const customFetch = useCustomFetch();
  const qty = ref(1);

  const create_custom_booking = async (
    body: {
      serviceRequirementId: number;
      qty: number;
      acceptedBidId: number;
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
        apiRoutes.bid_booking.create,
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

  const incrementQty = () => {
    qty.value += 1;
  };

  const decrementQty = () => {
    if (qty.value > 1) {
      qty.value -= 1;
    }
  };

  const resetCusutomBookingStore = () => {
    qty.value = 1;
  };

  return {
    create_custom_booking,
    creatingBooking,
    qty,
    incrementQty,
    decrementQty,
    resetCusutomBookingStore,
  };
});

export default useBookingStore;
