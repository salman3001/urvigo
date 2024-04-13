<script lang="ts" setup>
import { useChat } from "./useChat";
import { useChatStore } from "./useChatStore";

interface Props {
  isChatContact?: boolean;
  user: any;
}

const props = withDefaults(defineProps<Props>(), {
  isChatContact: false,
});

const store = useChatStore();
const { resolveAvatarBadgeVariant } = useChat();

const isChatContactActive = computed(() => {
  const isActive = store.activeChat?.contact.id === props.user.id;
  if (!props.isChatContact) return !store.activeChat?.chat && isActive;

  return isActive;
});
</script>

<template>
  <li
    class="chat-contact cursor-pointer d-flex align-center"
    :class="{ 'chat-contact-active': true }"
  >
    <VBadge
      dot
      location="bottom right"
      offset-x="3"
      offset-y="0"
      :color="resolveAvatarBadgeVariant(props.user.status)"
      bordered
      :model-value="props.isChatContact"
    >
      <VAvatar
        size="40"
        :variant="!props.user.avatar ? 'tonal' : undefined"
        :color="
          !props.user.avatar
            ? resolveAvatarBadgeVariant(props.user.status)
            : undefined
        "
      >
        <VImg
          v-if="props.user.avatar"
          :src="props.user.avatar"
          alt="John Doe"
        />
        <span v-else>{{ avatarText("Salman Khan") }}</span>
      </VAvatar>
    </VBadge>
    <div class="flex-grow-1 ms-4 overflow-hidden">
      <p class="text-base text-high-emphasis mb-0">Salman Khkan</p>
      <p class="mb-0 text-truncate text-body-2">
        {{
          props.isChatContact && "chat" in props.user
            ? props.user.chat.lastMessage.message
            : props.user.about
        }}
      </p>
    </div>
    <div v-if="true" class="d-flex flex-column align-self-start">
      <div class="text-body-2 text-disabled whitespace-no-wrap">
        {{ formatDateToMonthShort(props.user.chat.lastMessage.time) }}
      </div>
      <VBadge
        v-if="true"
        color="error"
        inline
        :content="'unread'"
        class="ms-auto"
      />
    </div>
  </li>
</template>

<style lang="scss">
@use "@core/scss/template/mixins" as templateMixins;
@use "@styles/variables/vuetify.scss";
@use "@core/scss/base/mixins";
@use "vuetify/lib/styles/tools/states" as vuetifyStates;

.chat-contact {
  border-radius: vuetify.$border-radius-root;
  padding-block: 8px;
  padding-inline: 12px;

  @include mixins.before-pseudo;
  @include vuetifyStates.states($active: false);

  &.chat-contact-active {
    @include templateMixins.custom-elevation(var(--v-theme-primary), "sm");

    background: rgb(var(--v-theme-primary));
    color: #fff;

    --v-theme-on-background: #fff;
  }

  .v-badge--bordered .v-badge__badge::after {
    color: #fff;
  }
}
</style>
