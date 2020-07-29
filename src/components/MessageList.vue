<template>
  <blockquote class="chat-boxes">
    <transition-group name="bounceDown">
      <template v-for="message in messages">
        <Message :key="message.id" :message="message" />
      </template>
    </transition-group>
    <div ref="messagesEndRef" />
  </blockquote>
</template>

<script>
import { onMounted, ref, watch, nextTick } from "vue";
import { useMessages } from "../store/store";
import Message from "./Message";

export default {
  name: "MessageList",
  setup() {
    const messagesEndRef = ref(null);
    const { messages } = useMessages();

    onMounted(() => {
      messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
    });

    watch(messages, async newMessages => {
      //雖然通常鼓勵開發人員用數據驅動(data-driven)的方式思考，避免直接接觸DOM，但有時我們必須要這麼做，這就是nextTick的
      //使用時機=>等待DOM渲染完成才執行回調
      await nextTick(() => {
        if (newMessages)
          messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
      });
    });

    return {
      messages,
      messagesEndRef
    };
  },
  components: {
    Message
  }
};
</script>

<style lang="scss" scoped>
.chat-boxes {
  height: 85vh;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 10px 10px 0 0;
  border: 1px solid rgba(150, 145, 145, 0.3);
  //background: transparent;//linear-gradient(135deg, #6E6E90 0%, #9E5276 100%);
  background-image: url("../img/bg.jpg");
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
  overflow: auto;
}
</style>
