const io = require("socket.io");

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
    const userSocket = USER_SOCKETS[agent];
    if (userSocket) {
      userSocket.emit(ORDER, { order, thread });
      res.send(201, { data: { order_no: order.order_no } });
    }
  };

  const emitThread = (req, res, next) => {
    const { thread, agent } = req.payload;
    const userSocket = USER_SOCKETS[agent];
    if (userSocket) {
      userSocket.emit(THREAD, { thread });
      res.send(201);
    }
  };

  const emitMessage = (req, res, next) => {
    const { message, agent, order_no } = req.payload;
    const userSocket = USER_SOCKETS[agent];
    if (userSocket) {
      userSocket.emit(MESSAGE, { message, order_no });
      res.send(201);
    }
  };

  // const emitMessage = (req, res, next) => {
  //   const tickets = req.tickets;
  //   if (tickets.length > 0) {
  //     tickets.forEach(ticket => {
  //       const userSocket = USER_SOCKETS[ticket.agent._id];
  //       if (userSocket) {
  //         userSocket.emit(AGENT_QUEUE, ticket);
  //       }
  //     });
  //     res.send(201);
  //   }
  // };

  return {
    emitThread,
    emitMessage,
    emitNewOrder
  };
};
