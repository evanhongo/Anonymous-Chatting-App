<template>
  <div id="app">
    <div class="chat">
      <header class="chat-header">
        <label class="menu">&equiv;</label>
        <span class="name">IMatch</span>
      </header>
      <transition mode="out-in" name="fade">
        <ChatContainer v-if="isChatting" />
        <div class="chat-btn" v-on:click="handleClick" v-else>
          <transition name="bounce">
            <div class="btn btn-lg btn-primary" v-if="isIdle">開始配對</div>
            <div class="btn btn-lg btn-primary" v-else>取消配對</div>
          </transition>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import ChatContainer from "./components/ChatContainer";
import { useSocket } from "./socketio/vue-socketio";
import { useConfig } from "./store/store";

export default {
  name: "app",
  setup() {
    const { isIdle, isChatting } = useConfig();
    const { socket, prepare } = useSocket();
    const bounce = ref(true);

    function handleClick() {
      if (isIdle.value) socket.emit("waiting");
      else socket.emit("cancels");
      bounce.value = !bounce.value;
    }

    onMounted(() => {
      prepare();
    });

    return {
      isIdle,
      isChatting,
      handleClick,
      bounce
    };
  },
  components: {
    ChatContainer
  }
};
</script>

<style lang="scss" scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

.chat {
  position: fixed;
  width: 100%;
  height: 100%;
  header.chat-header {
    display: flex;
    align-items: center;
    padding-left: 20px;
    background-color: #3d2744;
    label.menu {
      display: block;
      float: left;
      font-size: 40px;
      color: #bbb186;
      cursor: pointer;
    }
    span.name {
      display: block;
      float: left;
      width: 85%;
      padding: 7px;
      text-align: left;
      font: {
        weight: bold;
        size: 25px;
      }
      margin-left: 10px;
      color: #dcb73e;
      text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
    }
  }
  .chat-btn {
    display: flex;
    justify-content: center;
    margin-top: 65vh;
    cursor: pointer;
    > * {
      position: absolute;
    }
  }
}
</style>
