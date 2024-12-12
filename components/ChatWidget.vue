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
// const messages = ref<Message[]> = ref([]);

const usersTyping = ref<User[]>([]);

// send messages to Chat API here
// and in the empty function below

async function handleNewMessage(message: Message) {
  messages.value.push(message);
  // console.log("messages array:", messages.value);

  usersTyping.value.push(bot.value);
  // console.log("usersTyping array:", usersTyping.value);

  
  const messagesForApi = computed<ApiMessage[]>(() => {
    return messages.value.map((m) => ({
      role: m.userId,
      content: m.text,
    }));
  });
  //   if(!messagesForApi.value) return;
  // console.log("messagesForApi array:", messagesForApi.value);

  const res = await $fetch("/api/ai", {
    method: "POST",
    body: {
      messages: messagesForApi.value,
    }
  })
  // console.log("response from Chat API:", res);

  if(!res.choices[0].message?.content) return;
  
  const msg = {
    id: res.id,
    userId: bot.value.id,
    createdAt: new Date(),
    text: res.choices[0].message?.content,
  }
  // console.log("message from Chat API:", msg);

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
