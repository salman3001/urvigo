import { defineStore } from "pinia";
import { ref } from "vue";

type IModalContent =
  | null
  | "confirm"
  | "deleteRecord"
  | "changeRole"
  | "changeAdminStatus"
  | "changeUserStatus"
  | "delete"
  | "contactMessage"
  | "addContinent"
  | "editContinent"
  | "addCountry"
  | "editCountry"
  | "addState"
  | "editState"
  | "addCity"
  | "editCity"
  | "addStreet"
  | "editStreet"
  | "addRole"
  | "deleteNotification"
  | "changeSupportTicketStatus"
  | "WebAddReview"
  | "webApplyCoupon"
  | "webPostRequirement"
  | "WebSearchFilter";

const modalStore = defineStore("modal", () => {
  const show = ref(false);
  const meta = ref<any>(null);
  const content = ref<IModalContent>(null);

  const togel = (type: IModalContent, metaData?: any) => {
    meta.value = metaData;
    content.value = type;
    show.value = true;
  };

  return {
    show,
    togel,
    content,
    meta,
  };
});

export default modalStore;
