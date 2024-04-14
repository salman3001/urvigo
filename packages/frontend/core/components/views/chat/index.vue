<script lang="ts" setup>
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import { useDisplay, useTheme } from "vuetify";
import { themes } from "@/plugins/vuetify/theme";
import ChatActiveChatUserProfileSidebarContent from "./ChatActiveChatUserProfileSidebarContent.vue";
import ChatLeftSidebarContent from "./ChatLeftSidebarContent.vue";
import ChatLog from "./ChatLog.vue";
import ChatUserProfileSidebarContent from "./ChatUserProfileSidebarContent.vue";
import dummyAvatar from "@images/dummy-avatar.webp";

// composables
const vuetifyDisplays = useDisplay();
const { isLeftSidebarOpen } = useResponsiveLeftSidebar(
  vuetifyDisplays.smAndDown,
);

// Perfect scrollbar
const chatLogPS = ref();

const scrollToBottomInChatLog = () => {
  const scrollEl = chatLogPS.value.$el || chatLogPS.value;
  scrollEl.scrollTop = scrollEl.scrollHeight;
};

const startConversation = () => {
  if (vuetifyDisplays.mdAndUp.value) return;
  isLeftSidebarOpen.value = true;
};

// User profile sidebar
const isUserProfileSidebarOpen = ref(false);

// Active chat user profile sidebar
const isActiveChatUserProfileSidebarOpen = ref(false);

// file input
const refInputEl = ref<HTMLElement>();

const { name } = useTheme();

const chatContentContainerBg = computed(() => {
  let color = "transparent";

  if (themes) color = themes?.[name.value].colors?.background as string;

  return color;
});

// mine

const selectedConversation = ref<IConversation | null>(null);
const getImageUrl = useGetImageUrl();
const { fetcher } = useFetchRef();
const message = ref("");
const newMessage = ref<null | IMessage>(null);
const user = useCookie("user") as unknown as Ref<IUser>;
const { connectSocket, disconnectSocket, socket } = useSocket();

const myIdentifier = `${user?.value?.userType}-${user?.value?.id}`;

const createMessage = async () => {
  if (message.value.length > 0) {
    try {
      const res = await fetcher(
        apiRoutes.chat.conversations.create_message(
          selectedConversation.value!.id,
        ),
        {
          method: "post",
          body: {
            body: message.value,
          },
        },
      );

      message.value = "";
    } catch (error) {
      console.log(error);
    }
  }

  nextTick(() => {
    scrollToBottomInChatLog();
  });
};

const openChatOfConversation = async (conversation: IConversation) => {
  selectedConversation.value = conversation;
  if (vuetifyDisplays.smAndDown.value) isLeftSidebarOpen.value = false;
  nextTick(() => {
    scrollToBottomInChatLog();
  });
};

const selectedParticipant = computed(() => {
  if (selectedConversation.value?.participant_one_identifier != myIdentifier) {
    return (
      selectedConversation.value?.participantOne?.adminUser ||
      selectedConversation.value?.participantOne?.user ||
      selectedConversation.value?.participantOne?.vendorUser
    );
  } else if (
    selectedConversation.value?.participant_two_identifier != myIdentifier
  ) {
    return (
      selectedConversation.value?.participantTwo?.adminUser ||
      selectedConversation.value?.participantTwo?.user ||
      selectedConversation.value?.participantTwo?.vendorUser
    );
  } else {
    return null;
  }
});

onMounted(() => {
  connectSocket("/chat/");
  socket?.value?.on("new-message", (message: IMessage) => {
    newMessage.value = message;
  });
});

onUnmounted(() => {
  disconnectSocket();
  socket.value?.removeAllListeners();
});

const temp = () => {
  console.log("logged");
};
</script>

<template>
  <VLayout class="chat-app-layout">
    <!-- 👉 user profile sidebar -->
    <VNavigationDrawer
      v-model="isUserProfileSidebarOpen"
      temporary
      touchless
      absolute
      class="user-profile-sidebar"
      location="start"
      width="370"
    >
      <ChatUserProfileSidebarContent
        :selectedConversation="selectedConversation"
        :selectedParticipant="selectedParticipant"
        @close="isUserProfileSidebarOpen = false"
      />
    </VNavigationDrawer>

    <!-- 👉 Active Chat sidebar -->
    <VNavigationDrawer
      v-model="isActiveChatUserProfileSidebarOpen"
      width="374"
      absolute
      temporary
      location="end"
      touchless
      class="active-chat-user-profile-sidebar"
    >
      <ChatActiveChatUserProfileSidebarContent
        :selected-participant="selectedParticipant!"
        @close="isActiveChatUserProfileSidebarOpen = false"
      />
    </VNavigationDrawer>

    <!-- 👉 Left sidebar   -->
    <VNavigationDrawer
      v-model="isLeftSidebarOpen"
      absolute
      touchless
      location="start"
      width="370"
      :temporary="$vuetify.display.smAndDown"
      class="chat-list-sidebar"
      :permanent="$vuetify.display.mdAndUp"
    >
      <ChatLeftSidebarContent
        :selectedConversation="selectedConversation!"
        :new-message="newMessage"
        v-model:isDrawerOpen="isLeftSidebarOpen"
        @open-chat-of-conversation="openChatOfConversation"
        @show-user-profile="isUserProfileSidebarOpen = true"
        @close="isLeftSidebarOpen = false"
      />
    </VNavigationDrawer>

    <!-- 👉 Chat content -->
    <VMain class="chat-content-container">
      <!-- 👉 Right content: Active Chat -->
      <div v-if="selectedConversation" class="d-flex flex-column">
        <!-- 👉 Active chat header -->
        <div
          class="active-chat-header d-flex align-center text-medium-emphasis bg-surface"
          v-if="selectedParticipant"
        >
          <!-- Sidebar toggler -->
          <IconBtn class="d-md-none me-3" @click="isLeftSidebarOpen = true">
            <VIcon icon="tabler-menu-2" />
          </IconBtn>

          <!-- avatar -->
          <div
            class="d-flex align-center cursor-pointer"
            @click="isActiveChatUserProfileSidebarOpen = true"
          >
            <VBadge
              dot
              location="bottom right"
              offset-x="3"
              offset-y="0"
              :color="''"
              bordered
            >
              <VAvatar
                size="40"
                :variant="'tonal'"
                :color="''"
                class="cursor-pointer"
              >
                <VImg
                  v-if="selectedParticipant?.profile?.avatar"
                  :src="
                    getImageUrl(
                      selectedParticipant?.profile?.avatar?.breakpoints
                        ?.thumbnail?.url,
                      dummyAvatar,
                    )
                  "
                  :alt="
                    selectedParticipant.first_name +
                    ' ' +
                    selectedParticipant.last_name
                  "
                />
                <span v-else>{{
                  avatarText(
                    selectedParticipant.first_name +
                      " " +
                      selectedParticipant.last_name,
                  )
                }}</span>
              </VAvatar>
            </VBadge>

            <div class="flex-grow-1 ms-4 overflow-hidden">
              <div class="text-h6 mb-0 font-weight-regular">
                {{
                  selectedParticipant.first_name +
                  " " +
                  selectedParticipant.last_name
                }}
              </div>
              <p class="text-truncate mb-0 text-body-2 capitalize">
                {{ selectedParticipant?.userType }}
              </p>
            </div>
          </div>

          <VSpacer />

          <!-- Header right content -->
          <div class="d-sm-flex align-center d-none text-medium-emphasis">
            <IconBtn>
              <VIcon icon="tabler-phone" />
            </IconBtn>
            <IconBtn>
              <VIcon icon="tabler-video" />
            </IconBtn>
            <IconBtn>
              <VIcon icon="tabler-search" />
            </IconBtn>
            <IconBtn @click="isActiveChatUserProfileSidebarOpen = true">
              <VIcon icon="tabler-dots-vertical" />
            </IconBtn>
          </div>
        </div>

        <VDivider />

        <!-- Chat log -->
        <PerfectScrollbar
          ref="chatLogPS"
          tag="ul"
          :options="{ wheelPropagation: false }"
          min
          class="flex-grow-1 d-flex flex-column-reverse"
          style="height: 65vh"
          @ps-x-reach-start="temp"
        >
          <ChatLog
            v-if="selectedConversation && selectedParticipant"
            :selectedConversation="selectedConversation!"
            :socket="socket"
            :newMessage="newMessage"
            :selectedParticipant="selectedParticipant"
          />
        </PerfectScrollbar>

        <!-- Message form -->
        <VForm
          class="chat-log-message-form mb-5 mx-5"
          @submit.prevent="createMessage"
        >
          <VTextField
            :key="1"
            v-model="message"
            variant="solo"
            density="default"
            class="chat-message-input"
            placeholder="Type your message..."
            autofocus
          >
            <template #append-inner>
              <div class="d-flex gap-1">
                <IconBtn>
                  <VIcon icon="tabler-microphone" size="22" />
                </IconBtn>
                <IconBtn @click="refInputEl?.click()">
                  <VIcon icon="tabler-paperclip" size="22" />
                </IconBtn>
                <VBtn @click="createMessage">
                  <template #append>
                    <VIcon icon="tabler-send" color="#fff" />
                  </template>
                  Send
                </VBtn>
              </div>
            </template>
          </VTextField>

          <input
            ref="refInputEl"
            type="file"
            name="file"
            accept=".jpeg,.png,.jpg,GIF"
            hidden
          />
        </VForm>
      </div>

      <!-- 👉 Start conversation -->
      <div
        v-else
        class="d-flex h-100 align-center justify-center flex-column"
        style="min-height: 65vh"
      >
        <VAvatar size="98" variant="tonal" color="primary" class="mb-4">
          <VIcon size="50" class="rounded-0" icon="tabler-message-2" />
        </VAvatar>

        <VBtn
          v-if="$vuetify.display.smAndDown"
          rounded="xl"
          @click="startConversation"
        >
          Start Conversation
        </VBtn>

        <p
          v-else
          style="max-inline-size: 40ch; text-wrap: balance"
          class="text-center text-disabled"
        >
          Start connecting with the people by selecting one of the contact on
          left
        </p>
      </div>
    </VMain>
  </VLayout>
</template>

<style lang="scss">
@use "@styles/variables/vuetify.scss";
@use "@core/scss/base/mixins.scss";
@use "@layouts/styles/mixins" as layoutsMixins;

// Variables
$chat-app-header-height: 76px;

// Placeholders
%chat-header {
  display: flex;
  align-items: center;
  min-block-size: $chat-app-header-height;
  padding-inline: 1.5rem;
}

.chat-start-conversation-btn {
  cursor: default;
}

.chat-app-layout {
  border-radius: vuetify.$card-border-radius;

  @include mixins.elevation(vuetify.$card-elevation);

  $sel-chat-app-layout: &;

  @at-root {
    .skin--bordered {
      @include mixins.bordered-skin($sel-chat-app-layout);
    }
  }

  .active-chat-user-profile-sidebar,
  .user-profile-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }

  .chat-list-header,
  .active-chat-header {
    @extend %chat-header;
  }

  .chat-list-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }
}

.chat-content-container {
  /* stylelint-disable-next-line value-keyword-case */
  background-color: v-bind(chatContentContainerBg);

  // Adjust the padding so text field height stays 48px
  .chat-message-input {
    .v-field__input {
      font-size: 0.9375rem !important;
      line-height: 1.375rem !important;
      padding-block: 0.6rem 0.5rem;
    }

    .v-field__append-inner {
      align-items: center;
      padding-block-start: 0;
    }

    .v-field--appended {
      padding-inline-end: 8px;
    }
  }
}

.chat-user-profile-badge {
  .v-badge__badge {
    /* stylelint-disable liberty/use-logical-spec */
    min-width: 12px !important;
    height: 0.75rem;
    /* stylelint-enable liberty/use-logical-spec */
  }
}
</style>
