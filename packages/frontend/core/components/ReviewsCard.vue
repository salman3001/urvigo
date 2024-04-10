<script setup lang="ts">
defineProps<{
  review: IReview;
}>();
</script>

<template>
  <VCol cols="12" lg="4" md="6">
    <VCard title="The Best Answers">
      <VCardText class="d-flex align-center flex-wrap">
        <VRating
          :model-value="review.rating"
          readonly
          density="compact"
          class="me-3"
        />
        <span class="text-subtitle-2">{{ review.rating }} Star</span>
      </VCardText>

      <VCardText>
        If you are looking for a new way to promote your business that won't
        cost you more money, maybe printing is one of the options you won't
        resist.
      </VCardText>

      <VCardText>
        become fast, easy and simple. If you want your promotional material to
        be an eye-catching
      </VCardText>

      <VCardActions>
        <VBtn>Location</VBtn>
        <VBtn>Reviews</VBtn>
      </VCardActions>
    </VCard>
  </VCol>
</template>
