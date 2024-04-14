<script lang="ts" setup>
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import Conversations from "./Conversations.vue";
import dummyAvatar from "@images/dummy-avatar.webp";
const search = ref("");

// mine
import { findObjectAndMoveToIndex0 } from "~/utils/helpers";

const props = defineProps<{
  isDrawerOpen: boolean;
  newMessage: null | IMessage;
  selectedConversation?: IConversation;
}>();

const emit = defineEmits<{
  (e: "openChatOfConversation", conversation: IConversation): void;
  (e: "showUserProfile"): void;
  (e: "close"): void;
  (e: "update:search", value: string): void;
}>();

const route = useRoute();
const { fetcher } = useFetchRef();
const getImageUrl = useGetImageUrl();
const user = useCookie("user") as unknown as Ref<IUser>;

const { data, pending, refresh } = await useAsyncData(async () => {
  const data = await fetcher<IPageRes<IConversation[]>>(
    apiRoutes.chat.conversations.list,
    {
      query: {
        page: 1,
      } as IQs,
    },
  );

  return data.data;
});

if (route.query?.newConversationId) {
  const existingConversation = data.value?.data.filter(
    (c) => c.id == (route.query.newConversationId as unknown as number),
  );
  if (existingConversation) {
    emit("openChatOfConversation", existingConversation[0]);
  } else {
    refresh();
  }
}

const conversationsRef = ref(data.value);

watch(data, () => {
  conversationsRef.value = data.value;
});

watch(
  () => props.newMessage,
  () => {
    if (props.newMessage !== null) {
      if (
        conversationsRef.value?.data.some(
          (c) => c.id == props.newMessage?.conversation_id,
        )
      ) {
        const newData = findObjectAndMoveToIndex0(
          conversationsRef?.value!.data,
          props.newMessage,
          "id",
          "conversation_id",
        );

        conversationsRef.value.data = newData as IConversation[];
        conversationsRef.value.data[0].messages[0] = props.newMessage;
      } else {
        refresh();
      }
    }
  },
);
</script>

<template>
  <!-- 👉 Chat list header -->
  <div v-if="user" class="chat-list-header">
    <VBadge
      dot
      location="bottom right"
      offset-x="3"
      offset-y="3"
      :color="'success'"
      bordered
    >
      <VAvatar
        size="40"
        class="cursor-pointer"
        @click="$emit('showUserProfile')"
      >
        <VImg
          :src="
            getImageUrl(
              user.profile?.avatar?.breakpoints?.thumbnail?.url,
              dummyAvatar,
            )
          "
          :alt="user.first_name + user.last_name"
        />
      </VAvatar>
    </VBadge>

    <AppTextField
      v-model="search"
      placeholder="Search..."
      prepend-inner-icon="tabler-search"
      class="ms-4 me-1 chat-list-search"
    />

    <IconBtn v-if="$vuetify.display.smAndDown" @click="$emit('close')">
      <VIcon icon="tabler-x" class="text-medium-emphasis" />
    </IconBtn>
  </div>
  <VDivider />

  <PerfectScrollbar
    tag="ul"
    class="d-flex flex-column gap-y-1 chat-contacts-list px-3 py-2 list-none"
    :options="{ wheelPropagation: false }"
  >
    <li class="list-none">
      <h5 class="chat-contact-header text-primary text-h5">Chats</h5>
    </li>

    <Conversations
      v-for="conversation in data?.data"
      :key="conversation.id"
      :conversation="conversation"
      :selected-conversation="selectedConversation"
      @click="
        () => {
          $emit('openChatOfConversation', conversation);
        }
      "
    />

    <span
      v-show="Array.isArray(data?.data) && data.data.length < 1"
      class="no-chat-items-text text-disabled"
      >No chats found</span
    >
  </PerfectScrollbar>
</template>

<style lang="scss">
.chat-contacts-list {
  --chat-content-spacing-x: 16px;

  padding-block-end: 0.75rem;

  .chat-contact-header {
    margin-block: 0.5rem 0.25rem;
  }

  .chat-contact-header,
  .no-chat-items-text {
    margin-inline: var(--chat-content-spacing-x);
  }
}

.chat-list-search {
  .v-field--focused {
    box-shadow: none !important;
  }
}
</style>
