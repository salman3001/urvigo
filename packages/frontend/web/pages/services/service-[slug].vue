<script setup lang="ts">
const route = useRoute();
const getImageUrl = useGetImageUrl();
import dummyAvatar from "@images/dummy-avatar.webp";

const addReviewModal = ref(false);

const { show } = useServiceApi.showBySlug();
const {
  data: service,
  pending: servicePending,
  refresh: refreshService,
} = await useAsyncData(async () => {
  const data = await show(route.params.slug as string);
  return data.data;
});

const { list: serviceList } = useServiceApi.list({
  page: 1,
  perPage: 10,
  field__service_category_id: service.value?.service_category_id,
});
const {
  data: similarServices,
  refresh,
  pending: similarServicesPending,
} = await useAsyncData(() => serviceList());
</script>

<template>
  <br />
  <br />
  <br />
  <br />
  <VContainer fluid>
    <VRow>
      <VCol cols="12" md="9">
        <VCard>
          <VCardItem :title="service?.name" class="pb-6">
            <template #subtitle>
              <div class="text-body-1">
                category.
                <span class="text-h6 d-inline-block">{{
                  service?.serviceCategory?.name
                }}</span>
              </div>
            </template>
            <template #append>
              <div class="d-flex gap-4 align-center">
                <VChip variant="tonal" color="error" size="small"
                  >{{ service?.serviceCategory?.name }}
                </VChip>
                <VIcon size="24" class="cursor-pointer" icon="tabler-share" />
                <VIcon
                  size="24"
                  class="cursor-pointer"
                  icon="tabler-bookmarks"
                />
              </div>
            </template>
          </VCardItem>
          <VCardText>
            <VCard flat border>
              <div class="px-2 pt-2 crousel-wrapper">
                <SwiperCrousel
                  :images="
                    service?.images?.length > 0
                      ? service?.images?.map((i) => i?.file?.url)
                      : [
                          getImageUrl(service?.thumbnail?.url),
                          getImageUrl(service?.thumbnail?.url),
                          getImageUrl(service?.thumbnail?.url),
                        ]
                  "
                />
                <!-- <VImg
                  :src="getImageUrl(service?.thumbnail?.url)"
                  :height="$vuetify.display.mdAndUp ? 440 : 250"
                  class="w-100 rounded"
                /> -->
              </div>
              <VCardText>
                <h5 class="text-h5 mb-4">About this service</h5>
                <p class="text-body-1">
                  {{ service?.short_desc }}
                </p>
                <VDivider class="my-6" />

                <h5 class="text-h5 mb-4">Service Variants</h5>
                <VRow>
                  <VCol cols="12" xl="6" v-for="variant in service?.variants">
                    <WebSelectVariant :variant="variant" />
                  </VCol>
                </VRow>
                <VDivider class="my-6" />

                <h5 class="text-h5 mb-4">Description</h5>
                <div v-html="service?.long_desc"></div>

                <VDivider class="my-6" />

                <h5 class="text-h5 mb-4">Listed By</h5>
                <div class="d-flex align-center gap-x-4">
                  <VAvatar
                    :image="
                      getImageUrl(
                        service?.vendorUser?.profile?.avatar?.breakpoints
                          ?.thumbnail?.url,
                        dummyAvatar,
                      )
                    "
                    size="38"
                  />
                  <div>
                    <NuxtLink
                      :to="routes.vendor_profile.view(service?.vendor_user_id!)"
                    >
                      <h6 class="text-h6 mb-1">
                        {{ service?.vendorUser?.first_name }}
                        {{ service?.vendorUser?.last_name }}
                      </h6>
                    </NuxtLink>
                    <div class="text-body-2">
                      {{ service?.vendorUser?.business_name }}
                    </div>
                  </div>
                </div>
              </VCardText>
            </VCard>
          </VCardText>
        </VCard>
        <br />

        <ReviewsOverview
          :total-reviews="service?.meta?.reviews_count"
          :rating="service?.avg_rating as unknown as number"
        >
          <div>
            <VBtn
              @click="
                () => {
                  addReviewModal = true;
                }
              "
            >
              <VIcon size="24" class="cursor-pointer" icon="tabler-plus" />
              Add Review</VBtn
            >
          </div>
        </ReviewsOverview>
        <br />
        <VRow>
          <VCol v-for="(r, i) in service?.reviews" :key="i">
            <ReviewsCard :review="r" />
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12" md="3">
        <h6 class="text-h6">Similar Services</h6>
        <div class="course-content">
          <ServiceCard2
            class="ma-2"
            v-for="(s, i) in similarServices?.data.data"
            :service="s"
            :key="i"
          />
        </div>
      </VCol>
    </VRow>
    <ModalAddReview
      v-model:isVisible="addReviewModal"
      :service-id="service!.id"
      @submit="
        async () => {
          await refreshService();
          addReviewModal = false;
        }
      "
    />
  </VContainer>
</template>

<style lang="scss" scoped>
.course-content {
  position: sticky;
}

.card-list {
  --v-card-list-gap: 16px;
}
</style>

<style lang="scss">
@use "@layouts/styles/mixins" as layoutsMixins;

body .v-layout .v-application__wrap {
  .course-content {
    .v-expansion-panels {
      border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
      border-radius: 6px;

      .v-expansion-panel {
        &--active {
          .v-expansion-panel-title--active {
            border-block-end: 1px solid
              rgba(var(--v-border-color), var(--v-border-opacity));

            .v-expansion-panel-title__overlay {
              opacity: var(--v-hover-opacity) !important;
            }
          }
        }

        .v-expansion-panel-title {
          .v-expansion-panel-title__overlay {
            background-color: rgba(var(--v-theme-on-surface));
            opacity: var(--v-hover-opacity) !important;
          }

          &:hover {
            .v-expansion-panel-title__overlay {
              opacity: var(--v-hover-opacity) !important;
            }
          }

          &__icon {
            .v-icon {
              block-size: 1.5rem !important;
              color: rgba(
                var(--v-theme-on-surface),
                var(--v-medium-emphasis-opacity)
              );
              font-size: 1.5rem !important;
              inline-size: 1.5rem !important;

              @include layoutsMixins.rtl {
                transform: scaleX(-1);
              }
            }
          }
        }

        .v-expansion-panel-text {
          &__wrapper {
            padding-block: 1rem;
            padding-inline: 0.75rem;
          }
        }
      }
    }
  }

  .card-list {
    .v-list-item__prepend {
      .v-list-item__spacer {
        inline-size: 8px !important;
      }
    }
  }
}
</style>
