export type ActiveChat = {
  chat?: any;
  contact: any;
} | null;

export const useChat = () => {
  const resolveAvatarBadgeVariant = (status: any) => {
    if (status === "online") return "success";
    if (status === "busy") return "error";
    if (status === "away") return "warning";

    return "secondary";
  };

  return {
    resolveAvatarBadgeVariant,
  };
};
