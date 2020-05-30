<template>
  <div>
    <MessageList />
    <MessageForm />
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useConfig, useMessages } from "../store/store";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import { useSocket } from "../socketio/vue-socketio";

export default {
  name: "ChatContainer",
  setup() {
    const { setStatus } = useConfig();
    const { addMessage, clearMessage } = useMessages();
    const { socket } = useSocket();

    onMounted(() => {
      socket.on("message", msg => {
        addMessage(msg);
      });

      socket.once("leaves", () => {
        socket.off("message");
        socket.off("matcher leaves");
        clearMessage();
        setStatus("idle");
      });

      socket.once("matcher leaves", () => {
        socket.off("message");
        socket.off("leaves");
        clearMessage();
        setStatus("idle");
      });
    });

    return { socket };
  },
  components: {
    MessageList,
    MessageForm
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
