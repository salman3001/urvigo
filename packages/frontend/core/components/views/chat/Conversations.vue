<script lang="ts" setup>
import dummyAvatar from "@images/dummy-avatar.webp";

interface Props {
  conversation: IConversation;
  selectedConversation?: IConversation;
}

const props = defineProps<Props>();

const getImageUrl = useGetImageUrl();
const user = useCookie("user") as unknown as Ref<IUser>;
const myIdentifier = `${user?.value?.userType}-${user?.value?.id}`;

const isChatContactActive = computed(() => {
  const isActive = props?.selectedConversation?.id === props.conversation.id;

  return isActive;
});

const computedParticipant = computed(() => {
  if (props.conversation.participant_one_identifier != myIdentifier) {
    return (
      props.conversation.participantOne?.adminUser ||
      props.conversation.participantOne?.user ||
      props.conversation.participantOne?.vendorUser
    );
  }

  if (props.conversation.participant_two_identifier != myIdentifier) {
    return (
      props.conversation.participantTwo?.adminUser ||
      props.conversation.participantTwo?.user ||
      props.conversation.participantTwo?.vendorUser
    );
  } else {
    return null;
  }
});
</script>

<template>
  <li
    class="chat-contact cursor-pointer d-flex align-center"
    :class="{ 'chat-contact-active': isChatContactActive }"
  >
    <VBadge
      dot
      location="bottom right"
      offset-x="3"
      offset-y="0"
      :color="'success'"
      bordered
      :model-value="true"
    >
      <VAvatar size="40" :variant="'tonal'">
        <VImg
          v-if="computedParticipant?.profile?.avatar"
          :src="
            getImageUrl(
              computedParticipant?.profile?.avatar?.breakpoints?.thumbnail?.url,
              dummyAvatar,
            )
          "
          :alt="
            computedParticipant?.first_name ||
            '' + ' ' + computedParticipant?.last_name
          "
        />
        <span v-else>{{
          avatarText(
            computedParticipant?.first_name ||
              "" + " " + computedParticipant?.last_name,
          )
        }}</span>
      </VAvatar>
    </VBadge>
    <div class="flex-grow-1 ms-4 overflow-hidden">
      <p class="text-base text-high-emphasis mb-0">
        {{
          computedParticipant?.first_name ||
          "" + " " + computedParticipant?.last_name
        }}
      </p>
      <p
        class="mb-0 text-truncate text-body-2"
        v-if="conversation?.messages[0]?.body"
      >
        {{ conversation?.messages[0]?.body }}
      </p>
      <p class="mb-0 text-truncate text-body-2" v-else>
        Say Hi to {{ computedParticipant?.first_name }}
      </p>
    </div>
    <div v-if="true" class="d-flex flex-column align-self-start">
      <div
        v-if="conversation?.messages[0]?.created_at"
        class="text-body-2 text-disabled whitespace-no-wrap"
      >
        {{ formatDateToMonthShort(conversation?.messages[0]?.created_at) }}
      </div>
      <div v-if="conversation.messages[0]">
        <VBadge
          v-if="
            conversation.meta?.unread_messages &&
            conversation.meta?.unread_messages > 0
          "
          color="error"
          inline
          :content="conversation.meta?.unread_messages"
          class="ms-auto"
        />
      </div>
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
