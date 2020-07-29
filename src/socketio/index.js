import { createSocketIO } from "./vue-socketio";

export default createSocketIO({
  addr: "https://anonymous-chatapp.herokuapp.com"
});
