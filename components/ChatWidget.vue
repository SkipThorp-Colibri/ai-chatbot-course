<script setup lang="ts">
import type { ApiMessage, Message, User } from "~/types";
import { ref, computed } from "vue";

const me = ref<User>({
  id: "user",
  avatar: "/avatar.jpg",
  name: "You",
});
const bot = ref<User>({
  id: "assistant",
  avatar: "/bot.jpg",
  name: "Botman",
});

const users = computed(() => [me.value, bot.value]);

const messages: Ref<Message[]> = ref([]);

const usersTyping = ref<User[]>([]);

// send messages to Chat API here
// and in the empty function below

async function handleNewMessage(message: Message) {
  messages.value.push(message);

  usersTyping.value.push(bot.value);

  const messagesForApi = computed<ApiMessage[]>(() => {
    return messages.value.map((m) => ({
      role: m.userId,
      content: m.text,
    })).slice(-10);
  });

  const res = await $fetch("/api/ai", {
    method: "POST",
    body: {
      messages: messagesForApi.value,
    }
  })

  if(!res.choices[0].message?.content) return;
  
  const msg = {
    id: res.id,
    userId: bot.value.id,
    createdAt: new Date(),
    text: res.choices[0].message?.content,
  }

  messages.value.push(msg);
  usersTyping.value = [];

  console.log("messagesForApi array:", messagesForApi.value);
}
</script>
<template>
  <ChatBox
    :me="me"
    :users="users"
    :messages="messages"
    @new-message="handleNewMessage"
    :usersTyping="usersTyping"
  />
</template>
