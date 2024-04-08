import { io, type Socket } from "socket.io-client";

export default function useSocket() {
  const user = useCookie("user") as Ref<IUser>;
  const socketToken = useCookie("socketToken");
  const socket = ref<Socket | null>(null);
  const config = useRuntimeConfig();

  const connectSocket = (url: string) => {
    if (!socket.value) {
      socket.value = io(config.public.baseApi + url || "", {
        transports: ["websocket"],
        auth: {
          "user-id": user?.value.id as unknown as string,
          "socket-token": socketToken.value || "",
          "user-type": user.value.userType || "",
        },
      });
    }
  };

  const disconnectSocket = () => {
    if (socket.value) {
      socket.value.removeAllListeners();
      socket.value.disconnect();
      socket.value = null;
    }
  };

  return {
    socket,
    connectSocket,
    disconnectSocket,
  };
}
