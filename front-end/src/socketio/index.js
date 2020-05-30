import { createSocketIO } from "./vue-socketio";

export default createSocketIO({
  addr: "http://localhost:4000"
});
