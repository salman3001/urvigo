<script lang="ts" setup>
import dummyAvatar from "@images/dummy-avatar.webp";
import { Socket } from "socket.io-client";

const props = defineProps<{
  selectedConversation: IConversation;
  selectedParticipant: IVendorUser | IAdminUser | IUser;
  socket: Socket | null;
  newMessage: null | IMessage;
}>();

const { fetcher } = useFetchRef();
const user = useCookie("user") as unknown as Ref<IUser>;
const getImageUrl = useGetImageUrl();
const loadingMore = ref(false);

const myIdentifier = `${user?.value.userType}-${user?.value.id}`;

const { data, pending, refresh } = await useAsyncData(async () => {
  const data = await fetcher<IPageRes<IMessage[]>>(
    apiRoutes.chat.conversations.messages(props.selectedConversation.id),
    {
      query: {
        page: 1,
        orderBy: "created_at:desc",
      } as IQs,
    },
  );
  return data.data;
});

const dataRef = ref(data.value);

watch(data, () => {
  dataRef.value = data.value;
});

watch(
  () => props.selectedConversation,
  () => {
    refresh();
  },
);

watch(
  () => props.newMessage,
  () => {
    if (
      props.newMessage !== null &&
      props.newMessage.conversation_id == props.selectedConversation.id
    ) {
      dataRef.value?.data.unshift(props.newMessage);
      if (dataRef.value?.data.length! > 19) {
        dataRef.value?.data.pop();
      }
    }
  },
);

const getMoreMessages = async () => {
  loadingMore.value = true;
  if (data.value?.meta.next_page_url) {
    const newData = await fetcher<IPageRes<IMessage[]>>(
      apiRoutes.chat.conversations.messages(props.selectedConversation.id),
      {
        query: {
          page: dataRef.value?.meta.current_page! + 1,
          orderBy: "created_at:desc",
        } as AdditionalParams,
      },
    );

    const joinedData = [
      ...(dataRef?.value?.data || []),
      ...newData?.data?.data,
    ];

    dataRef.value!.data = joinedData;
    dataRef.value!.meta = newData.data.meta;
  }

  loadingMore.value = false;
};
</script>

<template>
  <div class="chat-log pa-6" v-for="m in data?.data" :key="m.id">
    <div
      class="chat-group d-flex align-start"
      :class="[
        {
          'flex-row-reverse': m.user_identifier == myIdentifier,
        },
      ]"
    >
      <div
        class="chat-avatar"
        :class="m.user_identifier == myIdentifier ? 'ms-4' : 'me-4'"
      >
        <VAvatar size="32">
          <VImg
            :src="
              getImageUrl(
                selectedParticipant.profile?.avatar?.breakpoints?.thumbnail
                  ?.url,
                dummyAvatar,
              )
            "
            :alt="user.first_name + user.last_name"
          />
        </VAvatar>
      </div>
      <div
        class="chat-body d-inline-flex flex-column"
        :class="m.user_identifier == myIdentifier ? 'align-end' : 'align-start'"
      >
        <div
          class="chat-content py-2 px-4 elevation-2"
          style="background-color: rgb(var(--v-theme-surface))"
        >
          <p class="mb-0 text-base">{{ m.body }}</p>
        </div>
        <div :class="{ 'text-right': m.user_identifier == myIdentifier }">
          <VIcon
            v-if="m.user_identifier == myIdentifier"
            size="16"
            :color="'success'"
          />
          <span class="text-sm ms-2 text-disabled">{{
            formatDate(m.created_at, {
              hour: "numeric",
              minute: "numeric",
            })
          }}</span>
        </div>
      </div>
    </div>
  </div>
  <div v-if="loadingMore" class="chat-log pa-6" v-for="m in 5" :key="m">
    <div class="chat-group d-flex align-start flex-row-reverse">
      <VSkeletonLoader type="list-item" class="w-50" />
    </div>
    <div class="chat-group d-flex align-start">
      <VSkeletonLoader type="list-item" class="w-50" />
    </div>
  </div>
  <div v-else-if="data?.data?.length! > 1" class="d-flex justify-center w-100">
    <VBtn
      v-if="dataRef?.meta.next_page_url"
      variant="tonal"
      @click="
        () => {
          getMoreMessages();
          // y = -10000000000;
          // page += 1;
        }
      "
      >Load More</VBtn
    >
  </div>
</template>

<style lang="scss">
.chat-log {
  .chat-body {
    max-inline-size: calc(100% - 6.75rem);

    .chat-content {
      border-end-end-radius: 6px;
      border-end-start-radius: 6px;

      p {
        overflow-wrap: anywhere;
      }

      &.chat-left {
        border-start-end-radius: 6px;
      }

      &.chat-right {
        border-start-start-radius: 6px;
      }
    }
  }
}
</style>
