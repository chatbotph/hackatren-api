const io = require("socket.io");
const { sendData } = require("./utils/uni-response");

module.exports = api => {
  console.log("--------------------");
  console.log("SOCKET INITITALIZED");
  console.log("--------------------");

  const JOIN = "JOIN";
  const MESSAGE = "MESSAGE";
  const THREAD = "THREAD";
  const LOGOUT = "LOGOUT";
  const ORDER = "ORDER";

  const socket = io(api, { transports: ["websocket"] });
  const USER_SOCKETS = {};

  socket.on("connection", socket => {
    console.log("A USER JUST CONNECTED");
    socket.on(JOIN, user_id => {
      console.log(user_id);
      USER_SOCKETS[user_id] = socket;
    });

    socket.on(LOGOUT, user_id => {
      console.log("user logout", user_id);
      delete USER_SOCKETS[user_id];
    });
  });

  const emitNewOrder = (req, res, next) => {
    const { order, agent, thread } = req.payload;
    const org = req.org;
    const getAdminSockets = Object.keys(USER_SOCKETS).filter(
      socket => socket.indexOf(`_ADMIN_${org}`) > -1
    );
    const userSocket = USER_SOCKETS[`${agent}_${org}`];
    if (userSocket) {
      console.log(agent);
      userSocket.emit(ORDER, { order, thread });
    }
    getAdminSockets.forEach(socket => {
      console.log(socket);
      const adminSocket = USER_SOCKETS[socket];
      adminSocket.emit(ORDER, { order, thread });
    });
    // return res.send(201, { data: { order_no: order.order_no } });
    return sendData(res, "", { order_no: order.order_no }, 201);
  };

  const emitThread = (req, res, next) => {
    const { thread, agent } = req.payload;
    const org = req.org;
    const getAdminSockets = Object.keys(USER_SOCKETS).filter(
      socket => socket.indexOf(`_ADMIN_${org}`) > -1
    );
    const userSocket = USER_SOCKETS[`${agent}_${org}`];
    if (userSocket) {
      userSocket.emit(THREAD, { thread });
    }
    getAdminSockets.forEach(socket => {
      const adminSocket = USER_SOCKETS[socket];
      adminSocket.emit(THREAD, { thread });
    });
    return sendData(res);
  };

  const emitMessage = (req, res, next) => {
    const { message, agent, order_no } = req.payload;
    const org = req.org;
    const getAdminSockets = Object.keys(USER_SOCKETS).filter(
      socket => socket.indexOf(`_ADMIN_${org}`) > -1
    );
    const userSocket = USER_SOCKETS[`${agent}_${org}`];
    if (userSocket) {
      userSocket.emit(MESSAGE, { message, order_no });
    }
    getAdminSockets.forEach(socket => {
      const adminSocket = USER_SOCKETS[socket];
      adminSocket.emit(MESSAGE, { message, order_no });
    });
    return sendData(res);
  };

  const emitAgentMessage = (req, res, next) => {
    //IF AGENT SEND TO ADMIN
    //IF ADMIN SENT TO AGENT
    let sockets;
    const { message, order_no, agent } = req.payload;
    const org = req.org;
    if (message.type === 0) {
      //send to admin
      sockets = Object.keys(USER_SOCKETS).filter(
        socket => socket.indexOf(`_ADMIN_${org}`) > -1
      );
    } else {
      //send to agent
      sockets = Object.keys(USER_SOCKETS).filter(
        socket => socket.indexOf(`${agent}_${org}`) < 0
      );
    }
    sockets.forEach(socket => {
      const userSocket = USER_SOCKETS[socket];
      userSocket.emit(MESSAGE, { message, order_no });
    });
    return sendData(res);
  };

  return {
    emitThread,
    emitMessage,
    emitNewOrder,
    emitAgentMessage
  };
};
