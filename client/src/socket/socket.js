import { io } from "socket.io-client";

const socket = io("https://realtime-chat-web-app-ui2m.onrender.com");

export default socket;