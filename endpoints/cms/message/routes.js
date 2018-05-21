const create_message_v1 = require("./create_message");
const get_messages_v1 = require("./get_messages");
const message_agent_v1 = require("./message_agent");

module.exports = (api, socket) => {
  const { emitMessage } = socket;
  api.post({ path: "/api/v1/message" }, create_message_v1);
  api.post({ path: "/api/v1/message_agent" }, message_agent_v1, emitMessage);
  api.get({ path: "/api/v1/message" }, get_messages_v1);
};
