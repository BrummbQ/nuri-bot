<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <TransitionGroup
    appear
    tag="div"
    :enter-active-class="'transform ease-out duration-300 transition'"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    move-class="transition ease-in-out duration-500"
  >
    <UiNotification
      v-for="notification in notifications"
      :severity="notification.severity"
      :key="notification.id"
      :toast="true"
      >{{ notification.message }}</UiNotification
    >
  </TransitionGroup>
</template>

<script setup lang="ts">
const { notifications } = useNotification();
</script>
