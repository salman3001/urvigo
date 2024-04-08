import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
  page?: number;
  orderBy?: string;
  search?: string | null;
  perPage?: number | null;
}

const createForm = {
  participant: {
    userType: "",
    userId: "",
  },
};

const messageForm = {
  body: "",
};
const updateForm = {};

class UseChatApi extends useBaseApi<
  IConversation,
  IPageRes<IConversation[]>,
  InitialQuery,
  typeof createForm,
  typeof updateForm
> {
  constructor() {
    super("/api/chat/conversations/", createForm, updateForm);
  }

  messages() {
    const { fetcher } = useFetchRef();

    const messages = async (
      converstaionId: number,
    ): Promise<IPageRes<IMessage[]>> =>
      fetcher(this.baseUrl + `/${converstaionId}/get-messages`);

    return {
      messages,
    };
  }

  cretaeMessage() {
    const { fetcher, loading } = useFetchRef();
    const form = reactive(messageForm);

    const create = async (
      converstaionId: number,
      cd?: {
        onSuccess?: () => void;
        onError?: () => void;
      },
    ) => {
      loading.value = true;
      try {
        const res = await fetcher<IResType<IConversation>>(
          this.baseUrl + `/${converstaionId}/create-message`,
          {
            method: "post",
            body: form,
          },
        );

        if (res.success == true) {
          cd?.onSuccess && cd?.onSuccess();
        }

        return res;
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
    };
  }
}

export const useChatApi = new UseChatApi();
