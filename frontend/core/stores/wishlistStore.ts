import { defineStore } from "pinia";
import { ref } from "vue";
import { useWishlistApi } from "~/composables/api/useWishlistApi";

const wishlistStore = defineStore("wishlistStore", () => {
  const wishlistItems = ref<IServiceVariant[]>([])

  const fetchWishlist = async () => {
    const { show } = useWishlistApi.show()
    const { data, success } = await show(0)
    if (success == true) {
      wishlistItems.value = data.items
    }
  }

  const fetchDetailedWishlist = async () => {
    const { detailList } = useWishlistApi.detailList()
    const { data, success } = await detailList()
    return data
  }

  const addWishlistItem = async (serviceId: number) => {
    const { addItem, form, loading: addingItem } = useWishlistApi.addItem({
      serviceId: ''
    })

    form.serviceId = serviceId as unknown as string
    const res = await addItem()
    if (res?.success == true) {
      wishlistItems.value.push({ id: serviceId } as IServiceVariant)
    }
  }

  const removeWishlistItem = async (serviceId: number) => {
    const { deletItem } = useWishlistApi.deletItem()
    const res = await deletItem(serviceId)
    if (res?.success == true) {
      const newList = wishlistItems.value.filter((item) => item.id != serviceId)
      wishlistItems.value = newList
    }
  }

  const clearWishlist = async () => {
    const { destroy } = useWishlistApi.destroy()
    const res = await destroy(0)
    if (res?.success == true) {
      wishlistItems.value = []
    }
  }

  return {
    wishlistItems,
    fetchWishlist,
    addWishlistItem,
    removeWishlistItem,
    clearWishlist,
    fetchDetailedWishlist
  };
});

export default wishlistStore;
