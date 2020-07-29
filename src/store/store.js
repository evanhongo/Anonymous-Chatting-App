import { inject, reactive, ref, computed } from "vue";

const configKey = Symbol();
const config = reactive({ status: "idle", userId: null });
const messagesKey = Symbol();
const messages = ref([]);

export function createStore() {
  return new Store();
}

export class Store {
  install(Vue) {
    Vue.provide(configKey, config);
    Vue.provide(messagesKey, messages);
  }
}

export function useConfig() {
  const config = inject(configKey);

  const isIdle = computed(() => config.status === "idle");
  const isChatting = computed(() => config.status === "chatting");

  function setStatus(status) {
    config.status = status;
  }

  function setUserId(userId) {
    config.userId = userId;
  }

  return {
    config,
    isIdle,
    isChatting,
    setStatus,
    setUserId
  };
}

export function useMessages() {
  const messages = inject(messagesKey);

  function initMessage(msgs) {
    messages.value = msgs;
  }

  function addMessage(msg) {
    messages.value = [...messages.value, msg];
    //messages.value.push(msg); 不會觸發update
  }

  function clearMessage() {
    messages.value = [];
  }

  return {
    messages,
    initMessage,
    addMessage,
    clearMessage
  };
}
