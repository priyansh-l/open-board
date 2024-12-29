const express = require("express");
const socket = require("socket.io");
// yeh socket ek function hai express ki tarah initialization

const app = express();

let port = process.env.PORT || 5000;
// is instance ko nicche send karenge
// (app.listen ek server instance return kerta hai)

app.use(express.static("public"));
let server = app.listen(port, () => {
  console.log("listening on the port: " + port);
});
// connection ke liye server ki instance leni hogi
let io = socket(server);
// socket ko call kiya ek server pass kerte hue

io.on("connection", (socket_instance) => {
  console.log("connection set hogaya");
  // ager beginPath karke koi event aayi canvas se
  // to dusra argument pass ker dena function me
  // iss line ka yeh matlab hai ki
  // mere computer se server ke pass phock gaya hai
  // data ab mujhe aage bhejne ke liye
  socket_instance.on("beginPath", (data) => {
    // ab sabhi connected computers ko send kerne ke liye
    // neeche wala code hai
    io.sockets.emit("beginPath", data);
  });
  socket_instance.on("drawStroke", (data) => {
    io.sockets.emit("drawStroke", data);
  });
  socket_instance.on("undoRedoProcess", (data) => {
    io.sockets.emit("undoRedoProcess", data);
  });
});

// pahle server start hoga,phir jab client apne browser
// pe localhost:5000 type karega,tab server public folder me
// jake sabse pahle index.HTML show karega use(jo ki ek
// static file hai)
