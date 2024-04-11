<script setup lang="ts">
import dummyThumb from "@images/dummy-avatar.webp";
import { format } from "date-fns";
const getImageUrl = useGetImageUrl();

defineProps<{
  review: IReview;
}>();
</script>

<template>
  <VCard title="The Best Answers">
    <VCardText class="d-flex align-center flex-wrap">
      <RatingComponent :rating="review.rating" size="1.25rem" />
      <span class="text-subtitle-2"
        >{{ review.rating }} Star |
        {{ format(review.created_at, "dd/MM/yyyy HH:mmA") }}</span
      >
    </VCardText>

    <VCardText>
      {{ review.message }}
    </VCardText>
    <VCardActions>
      <VAvatar
        :image="getImageUrl(review?.user?.profile?.avatar?.url, dummyThumb)"
      />
      <div>
        <span
          >{{ review?.user?.first_name }} {{ review?.user?.last_name }}</span
        >
        <p class="text-muted">
          <VChip class="text-bold" color="primary" outline
            >Verified purchase</VChip
          >
        </p>
      </div>
    </VCardActions>
  </VCard>
</template>
