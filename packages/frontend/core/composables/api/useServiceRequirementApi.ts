import { useBaseApi } from "./useBaseApi";
import { format, add } from "date-fns";

interface InitialQuery {
  page?: number;
  field__is_active?: boolean;
  field__accepted_bid_id?: number | null;
  orderBy?: string;
  search?: string | null;
  perPage?: number | null;
  where_expires_at_lt?: string | null;
  where_expires_at_gt?: string | null;
  where_active?: null | number;
  where_acepted?: null | number;
}

const createForm = {
  title: "",
  desc: "",
  keywords: [],
  urgent: false,
  budgetUnit: "",
  budget: "",
  expiresAt: format(add(Date.now(), { days: 3 }), "dd/MM/yyyy HH:mm"),
  location: "-2.2,37.7",
  serviceCategoryId: "",
  images: null,
};
const updateForm = {};

const negotiateForm = {
  bidId: "",
  price: "",
  message: "",
};

class UseServiceRequirementApi extends useBaseApi<
  IServiceRequirement,
  IPageRes<IServiceRequirement[]>,
  InitialQuery,
  typeof createForm,
  typeof updateForm
> {
  constructor() {
    super("/api/service-requirements", createForm, updateForm);
  }

  myList(initialQuery: InitialQuery) {
    const { fetcher } = useFetchRef();

    const query = reactive(initialQuery);

    const list = async (): Promise<IPageRes<IServiceRequirement[]>> =>
      fetcher(this.baseUrl + "/my-list", {
        query: query,
      });

    return {
      query,
      list,
    };
  }

  showBids(initialQuery: {
    page: number | null;
    orderBy: string | null;
    orderby_lowest_price: string | number | null;
    orderby_avg_rating: string | number | null;
  }) {
    const { fetcher, loading } = useFetchRef();

    const query = reactive(initialQuery);

    const showBids = async (requirementId: number): Promise<IPageRes<IBid[]>> =>
      fetcher(this.baseUrl + `/${requirementId}/show-bids`, {
        query: query,
      });

    return {
      query,
      showBids,
    };
  }

  showAcceptedBid() {
    const { fetcher, loading } = useFetchRef();
    const showAcceptedBid = async (
      requirementId: number,
    ): Promise<IResType<IBid>> =>
      fetcher(`${this.baseUrl}/${requirementId}/accepted-bid`);
    return { showAcceptedBid };
  }

  showVendorPlacedbid() {
    const { fetcher, loading } = useFetchRef();
    const showVendorPlacedbid = async (
      requirementId: number,
    ): Promise<IResType<IBid>> =>
      fetcher(`${this.baseUrl}/${requirementId}/show-vendor-placed-bid`);
    return { showVendorPlacedbid };
  }

  negotiate() {
    const { fetcher, loading, errors } = useFetchRef();
    const form = reactive(negotiateForm);

    const create = async (
      requirementId: number,
      cd?: {
        onSuccess?: () => void;
        onError?: () => void;
      },
    ) => {
      loading.value = true;
      const formData = convertToFormData(form);
      try {
        const res = await fetcher<IResType<any>>(
          `${this.baseUrl}/${requirementId}/negotiate-price`,
          {
            method: "post",
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
      create,
      form,
      loading,
      errors,
    };
  }
}

export const useServiceRequirementApi = new UseServiceRequirementApi();
