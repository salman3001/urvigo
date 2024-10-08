import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
  page?: number;
  orderBy?: string;
  search?: string | null;
  perPage?: number | null;
}

const createForm = {
  serviceRequirementId: "",
  acceptedBidId: "",
  qty: 1,
  paymentdetail: {
    paymentMode: "",
    paymentStatus: "",
  },
};

const updateForm = {};

const updateStatusForm = {
  status: OrderStatus,
  remarks: "",
};

class UseBidBookingApi extends useBaseApi<
  IBidBooking,
  IPageRes<IBidBooking[]>,
  InitialQuery,
  typeof createForm,
  typeof updateForm
> {
  constructor() {
    super("/api/bid-bookings", createForm);
  }

  mylist(initialQry: InitialQuery) {
    const { fetcher, loading } = useFetchRef();

    const query = reactive(initialQry);

    const mylist = async (): Promise<IPageRes<IBidBooking[]>> =>
      fetcher(this.baseUrl + "/my-list", {
        query: query,
      });

    return {
      query,
      mylist,
    };
  }

  updateStatus(initialForm: typeof updateStatusForm) {
    const { fetcher, loading, errors } = useFetchRef();
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
      errors,
    };
  }
}

export const useBidBookingApi = new UseBidBookingApi();
