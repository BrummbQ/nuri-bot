const loginUrl = "/auth/login";

export default async function (redirect?: string) {
  const { logout } = useAuth();
  logout();

  if (!redirect) {
    return await navigateTo(loginUrl);
  }

  await navigateTo({
    path: loginUrl,
    query: { redirect },
  });
}
