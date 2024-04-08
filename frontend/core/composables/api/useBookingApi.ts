import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
  page?: number;
  orderBy?: string;
  search?: string | null;
  perPage?: number | null;
}

const createForm = {};

const updateForm = {};

const updateStatusForm = {
  status: OrderStatus,
  remarks: "",
};

class UseBookingApi extends useBaseApi<
  IBooking,
  IPageRes<IBooking[]>,
  InitialQuery,
  typeof createForm,
  typeof updateForm
> {
  constructor() {
    super("/api/bookings", createForm, updateForm);
  }

  customerBookings(initialQry: InitialQuery) {
    const { fetcher } = useFetchRef();

    const query = reactive(initialQry);

    const customerBookings = async (): Promise<IPageRes<IBooking[]>> =>
      fetcher(this.baseUrl + "/customer-bookings", {
        query: query,
      });

    return {
      query,
      customerBookings,
    };
  }

  vendorBookings(initialQry: InitialQuery) {
    const { fetcher } = useFetchRef();

    const query = reactive(initialQry);

    const vendorBookings = async (): Promise<IPageRes<IBooking[]>> =>
      fetcher(this.baseUrl + "/vendor-bookings", {
        query: query,
      });

    return {
      query,
      vendorBookings,
    };
  }

  bookingSummary() {
    const { fetcher } = useFetchRef();
    const bookingSummary = async (): Promise<IResType<any>> =>
      fetcher(this.baseUrl + "/summary");

    return {
      bookingSummary,
    };
  }

  couponList() {
    const { fetcher, loading } = useFetchRef();
    const couponList = async (variantId: number): Promise<IResType<any>> =>
      fetcher(this.baseUrl + `/get-coupons?serviceVariantId=${variantId}`);

    return {
      couponList,
    };
  }

  updateStatus(initialForm: typeof updateStatusForm) {
    const { fetcher, loading } = useFetchRef();
    const form = reactive(initialForm);

    const update = async (
      id: number,
      cd?: {
        onSuccess?: () => void;
        onError?: () => void;
      },
    ) => {
      loading.value = true;
      const formData = convertToFormData(form);
      try {
        const res = await fetcher<IResType<IBooking>>(
          this.baseUrl + `/${id}/update-status`,
          {
            method: "put",
            body: formData,
          },
        );

        if (res.success == true) {
          cd?.onSuccess && cd?.onSuccess();
        }
      } catch (error) {
        console.log(error);
        cd?.onError && cd?.onError();
      }

      loading.value = false;
    };

    return {
      update,
      form,
      loading,
    };
  }
}

export const useBookingApi = new UseBookingApi();
