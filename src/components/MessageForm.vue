/* eslint-disable semi */
<template>
  <form class="chat-footer fixed-bottom" v-on:submit.prevent="handleSubmit">
    <input
      type="button"
      value="離開"
      class="leave-btn"
      v-on:click="handleLeave"
    />
    <input type="text" v-model="text" placeholder="請輸入訊息..." />
    <input type="submit" value="送出訊息" />
  </form>
</template>

<script>
import { ref } from "vue";
import { useSocket } from "../socketio/vue-socketio";

export default {
  name: "MessageForm",
  setup() {
    const text = ref("");
    const { socket } = useSocket();

    async function handleSubmit() {
      await socket.emit("message", text.value);
      text.value = "";
    }

    function handleLeave() {
      socket.emit("leaves");
    }

    return {
      text,
      handleSubmit,
      handleLeave
    };
  }
};
</script>

<style lang="scss" scoped>
.chat-footer {
  padding: 10px 10px;
  background-color: #4d3f5a;
  .leave-btn {
    width: 60px;
    font-size: 15px;
    padding: 8px;
    border: 2px solid #f3b23b;
    color: #f3b23b;
    &:hover {
      background-color: #695d71;
    }
  }
  input[type="text"] {
    width: calc(100% - 60px - 80px);
    height: 50px;
    font-size: 15px;
    padding-left: 20px;
    border: 2px solid #757884;
    outline: none;
    -moz-border-radius: 30px;
    -webkit-border-radius: 30px;
    border-radius: 30px;
  }
  input[type="submit"] {
    width: 80px;
    font-size: 15px;
    padding: 8px;
    border: 2px solid #f3b23b;
    color: #f3b23b;
    &:hover {
      background-color: #695d71;
    }
  }
}
</style>
