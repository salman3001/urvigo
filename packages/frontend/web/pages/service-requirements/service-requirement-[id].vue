<script setup lang="ts">
definePageMeta({
  middleware: "is-logged-in",
});

const route = useRoute();
const bidDetailModal = ref(false);

const selectedBid = ref<IBid | null>(null);
const { show } = useServiceRequirementApi.show();
const { showAcceptedBid } = useServiceRequirementApi.showAcceptedBid();

const { data, refresh: refreshRequirement } = await useAsyncData(
  ("service-requirement" + route.params.id) as string,
  async () => {
    const [serviceRequirement, acceptedBid] = await Promise.all([
      show(route.params.id as unknown as number),
      showAcceptedBid(route.params.id as unknown as number),
    ]);

    return {
      serviceRequirement: serviceRequirement.data,
      acceptedBid: acceptedBid.data,
    };
  },
);

const { query: bidQuery, showBids } = useServiceRequirementApi.showBids({
  page: 1,
  orderBy: "created_at:asc",
  orderby_lowest_price: "",
  orderby_avg_rating: "",
  perPage: 20,
});

const {
  data: recivedBids,
  pending,
  refresh: refreshBids,
} = await useAsyncData(
  "recieved-bids" + route.params.id + bidQuery.page,
  async () => {
    const data = await showBids(route.params.id as unknown as number);

    return data.data;
  },
);

const sortByVendorRating = () => {
  bidQuery.orderBy = "";
  bidQuery.orderby_avg_rating = "1";
  bidQuery.orderby_lowest_price = "";
  refreshBids();
};

const sortByLowestPrice = () => {
  bidQuery.orderBy = "";
  bidQuery.orderby_avg_rating = "";
  bidQuery.orderby_lowest_price = "1";
  refreshBids();
};

const refreshData = async () => {
  await refreshRequirement();
  bidQuery.orderBy = "created_at:asc";
  bidQuery.orderby_avg_rating = "";
  bidQuery.orderby_lowest_price = "";
  await refreshBids();
};

const { form: creatChatForm, create } = useChatApi.cretae();
const createChat = async () => {
  creatChatForm.participant.userId = data.value?.acceptedBid?.vendorUser
    ?.id as unknown as string;
  creatChatForm.participant.userType = data.value?.acceptedBid?.vendorUser
    ?.userType as unknown as string;

  const res = await create();
  console.log(res);

  if (res?.success == true) {
    navigateTo({
      path: routes.chats,
      query: {
        newConversationId: res?.data?.id,
      },
    });
  }
};
</script>

<template>
  <br />
  <br />
  <br />
  <br />
  <VContainer>
    <div>
      <RequirementCard :requirement="data?.serviceRequirement!" />
      <br />
      <br />
      <div class="" style="max-width: 95vw">
        <div>
          <h3 class="text-bold">Acceped Bid</h3>
        </div>
        <br />

        <div class="row">
          <div v-if="!data?.acceptedBid" class="text-subtitle1">
            <p>You haven't accepted any bid yet. Please accept a bid</p>
            <br />
          </div>
          <WebProposalCard
            v-else
            :accepted="true"
            :bid="data?.acceptedBid"
            @create-chat="createChat()"
            :any-bid-accepted="data.acceptedBid ? true : false"
            :requirement-id="data.serviceRequirement.id"
            @bid-rejected="refreshData"
            @review="
              (v) => {
                selectedBid = v;
                bidDetailModal = true;
              }
            "
          />
        </div>
        <br />
        <br />
        <div class="d-flex flex-column gap-4">
          <div class="d-flex justify-space-between items-center gap-4">
            <div>
              <h3 class="text-bold">Bids Recieved</h3>
            </div>
            <div class="d-flex items-center gap-2">
              <VChip color="primary" v-if="bidQuery.orderby_avg_rating == '1'"
                >Sorting by Top Rating</VChip
              >
              <VChip color="primary" v-if="bidQuery.orderby_lowest_price == '1'"
                >Sorting by Lowest Price</VChip
              >

              <DropDown name="Filter" left-icon="tabler-filter">
                <v-list-item @click="sortByVendorRating">
                  <v-list-item-title> Highest Rating</v-list-item-title>
                </v-list-item>
                <v-list-item @click="sortByLowestPrice">
                  <v-list-item-title>Lowest Price</v-list-item-title>
                </v-list-item>
              </DropDown>
            </div>
          </div>
          <br />

          <div>
            <div v-if="pending">
              <VSkeletonLoader type="list" v-for="i in 3" :key="i" />
            </div>
            <div v-else-if="recivedBids?.data?.length < 1">
              No Bids Recieved..
            </div>
            <VRow v-else class="row gap-100">
              <VCol
                v-for="bid in recivedBids?.data"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <WebProposalCard
                  :accepted="false"
                  :bid="bid"
                  :any-bid-accepted="data?.acceptedBid ? true : false"
                  @bid-accpted="refreshData"
                  @review="
                    (v) => {
                      selectedBid = v;
                      bidDetailModal = true;
                    }
                  "
                />
              </VCol>
            </VRow>
            <br />
            <br />
            <TablePagination
              :page="Number(bidQuery.page)"
              :items-per-page="Number(bidQuery?.perPage)"
              :total-items="Number(recivedBids?.meta?.total)"
              @update:page="
                (p) => {
                  bidQuery.page = p;
                }
              "
            />
          </div>
        </div>
      </div>
    </div>
    <ModalBidDetail
      v-model="bidDetailModal"
      :accepted-bid="data?.acceptedBid!"
      :service-requirement="data?.serviceRequirement!"
      @create-chat="createChat"
      @refresh-bids="
        () => {
          refreshBids();
        }
      "
      :selected-bid="selectedBid!"
    />
  </VContainer>
</template>
