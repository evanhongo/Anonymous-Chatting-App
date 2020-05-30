import { inject } from "vue";
import { useConfig, useMessages } from "../store/store";
import io from "socket.io-client";

const socketKey = Symbol();

export function createSocketIO({ addr }) {
  return new SocketIO({ addr });
}

export class SocketIO {
  constructor({ addr }) {
    this.socket = io(addr);
  }

  install(Vue) {
    Vue.provide(socketKey, this.socket);
  }
}

export function useSocket() {
  const socket = inject(socketKey);

  function prepare() {
    const { setStatus, setUserId } = useConfig();
    const { initMessage } = useMessages();
    socket.emit("init", localStorage.getItem("userId"));

    socket.on("init", data => {
      if (data.userId) {
        localStorage.setItem("userId", data.userId);
        setUserId(data.userId);
      } else {
        setUserId(localStorage.getItem("userId"));
        switch (data.status) {
          case "waiting":
            setStatus("waiting");
            break;
          case "chatting":
            initMessage(data.messages);
            setStatus("chatting");
            break;
          default:
            break;
        }
      }
    });

    socket.on("waiting", () => {
      setStatus("waiting");
    });

    socket.on("cancels", () => {
      setStatus("idle");
    });

    socket.on("matched", () => {
      setStatus("chatting");
    });
  }

  return { socket, prepare };
}
