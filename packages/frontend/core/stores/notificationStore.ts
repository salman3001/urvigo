import { defineStore } from "pinia";
import { Notify } from "quasar";
import { Socket, io } from "socket.io-client";
import { ref } from "vue";
import { notifcationApi } from "~/utils/api/notificationApi";

const notificationStore = defineStore("notification", () => {
  const notifcations = ref<any[]>([]);
  const notificationCount = ref(0);
  const socket = ref<Socket | null>(null);

  const playSound = () => {
    const audio = new Audio("/audio/iphone_sound.mp3");
    audio.play();
  };

  const getMenuNotifications = async () => {
    notifcationApi.getMenuNotifications().then((data) => {
      notifcations.value = (data as any)?.notifcations;
      notificationCount.value = (data as any)?.count;
    });
  };

  const deleteNotifcations = async (type: "all" | "read") => {
    if (type == "all") {
      const { execute } = notifcationApi.deleteAllNotifcations({
        onResponse: () => {
          notifcations.value = [];
          notificationCount.value = 0;
        },
      });
      execute();
    } else if (type == "read") {
      await notifcationApi
        .deleteReadNotifcations({
          onResponse: () => {
            getMenuNotifications();
          },
        })
        .execute();
    }
  };

  const deleteOneNotifcation = async (id: string) => {
    const { execute } = notifcationApi.delete({
      onResponse: () => {
        getMenuNotifications();
      },
    });
    execute(id);
  };

  const markAsRead = async (id: string) => {
    const { execute } = notifcationApi.markAsRead(
      {},
      {
        onSuccess: () => {
          getMenuNotifications();
        },
      }
    );
    execute(id);
  };

  const connectSocket = (url: string, user: any, socketToken: any) => {
    if (!socket.value) {
      socket.value = io(url + "/notifications/", {
        transports: ["websocket"],
        auth: {
          userId: user?.id || "",
          socketToken: socketToken || "",
        },
      });

      socket.value.on("room-joined", (room: string) => {
        console.log(room);
      });

      socket.value.on("new-notification", (notification: any) => {
        if (notifcations.value.length < 20) {
          notifcations.value.push(notification);
          notificationCount.value += 1;
          Notify.create({
            icon: "info",
            color: "#FAF9F6",
            message: `New Notification! ${notification?.data?.message}`,
            timeout: 5000,
            position: "top",
          });
          playSound();
        } else {
          notifcations.value.pop();
          notifcations.value.unshift(notification);
          notificationCount.value += 1;
          Notify.create({
            icon: "info",
            color: "#FAF9F",
            message: `New Notification!  ${notification?.data?.message}`,
            timeout: 5000,
            position: "top",
          });
          playSound();
        }
      });
    }
  };

  const disconnectSocket = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }
  };

  return {
    notifcations,
    notificationCount,
    getMenuNotifications,
    deleteNotifcations,
    deleteOneNotifcation,
    connectSocket,
    disconnectSocket,
    markAsRead,
  };
});

export default notificationStore;
