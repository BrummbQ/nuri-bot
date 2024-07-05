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

  if (import.meta.client) {
    const authValue = sessionStorage.getItem(sessionStorageAuthKey);
    if (authValue) {
      user.value = JSON.parse(authValue);
    }
  }

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
      user.value = { ...result };
      sessionStorage.setItem(sessionStorageAuthKey, JSON.stringify(user.value));
      await nextTick();
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
    sessionStorage.removeItem(sessionStorageAuthKey);
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
