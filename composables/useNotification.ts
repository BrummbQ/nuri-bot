import { v4 as uuidv4 } from "uuid";

export type NotificationSeverity = "info" | "success" | "error";

export type Notification = {
  id: string;
  severity: NotificationSeverity;
  message: string;
};

export const useNotification = () => {
  const notificationsState = useState<Record<string, Notification>>(
    "notifications",
    () => ({}),
  );

  function addNotification(notification: Omit<Notification, "id">) {
    const id = uuidv4();
    notificationsState.value[id] = { ...notification, id };
    setTimeout(() => removeNotification(id), 5000);
  }

  function removeNotification(id: string) {
    delete notificationsState.value[id];
  }

  const notifications = computed(() => Object.values(notificationsState.value));

  return {
    addNotification,
    notifications,
    notificationsState,
  };
};
