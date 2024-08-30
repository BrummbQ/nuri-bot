// composables/useAuth.ts
import { ref } from "vue";

// Define a custom error type
type AuthError = {
  message: string;
  code?: string;
};

type User = {
  email: string;
  userId: string;
  sessionExpiresAt: number;
};

const sessionStorageAuthKey = "auth";

export function useAuth() {
  const user = useState<User | null>("user");
  const loading = ref<boolean>(false);
  const error = ref<AuthError | null>(null);
  const { getItem, setItem, removeItem } = useLocalStorage<User>();

  user.value = getItem(sessionStorageAuthKey);

  const sendMagicLink = async (email: string) => {
    loading.value = true;
    error.value = null;
    try {
      await $fetch("/api/auth/magic-link", {
        method: "POST",
        body: { email },
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = { message: e.message };
      } else if (typeof e === "object" && e !== null && "message" in e) {
        error.value = { message: String(e.message) };
      } else {
        error.value = { message: "An unknown error occurred" };
      }
    } finally {
      loading.value = false;
    }
  };

  const verifyToken = async (token: string) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await $fetch<User>("/api/auth/verify", {
        method: "POST",
        body: { token },
      });
      user.value = result;
      setItem(sessionStorageAuthKey, result);
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = { message: e.message };
      } else if (typeof e === "object" && e !== null && "message" in e) {
        error.value = { message: String(e.message) };
      } else {
        error.value = { message: "An unknown error occurred" };
      }
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    removeItem(sessionStorageAuthKey);
  };

  const loggedIn = computed(() => {
    return user.value != null && user.value.sessionExpiresAt > Date.now();
  });

  return {
    user,
    loading,
    error,
    sendMagicLink,
    verifyToken,
    logout,
    loggedIn,
  };
}
