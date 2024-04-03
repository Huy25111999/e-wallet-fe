import { presentToast } from "@/helpers/toastHelper";
import { filterNotification } from "@/api/notification";
import { computed } from "vue";
import { useStore } from "vuex";
import { useToastify } from "@/helpers/useToastify";
let stompClient: any = null;
const connectedPromise: any = null;
let alreadyConnectedOnce = false;
let connection;

const toastify = useToastify();

export const connect = () => {
  if (connectedPromise !== null || alreadyConnectedOnce) {
    // the connection is already being established
    return;
  }
  const store = useStore();
  const customerId = computed(() => store.getters.auth.customerId);

  const loc = window.location;
  const local =
    loc.host === "localhost:8080" ? "ewalletsocket.techasians.com" : "ewalletsocket.techasians.com";
  let url = "wss://" + local + "/websocket";
  if (customerId.value) {
    url += "?customerId=" + customerId.value;
  }
  const socket = new WebSocket(url);
  connection = socket;
  socket.onopen = () => {
    heartbeat();
    loadNotification();
  };
  socket.onmessage = (data) => {
    presentToast(data.data, "top");
    loadNotification();
  };
  function loadNotification() {
    filterNotification(customerId.value, {
      page: 1,
      size: 10,
    }).then((res) => {
      store.dispatch("notification/loadNotification", res.data);
    });
  }
  function heartbeat() {
    if (!socket) return;
    if (socket.readyState !== 1) {
      return;
    }
    socket.send("ping");
    setTimeout(heartbeat, 30000);
  }
};

export const disconnect = () => {
  if (connection !== null) {
    if (stompClient.connected) {
      stompClient.disconnect();
    }
    stompClient = null;
  }
  alreadyConnectedOnce = false;
};
