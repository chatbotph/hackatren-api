const create_message_v1 = require("./create_message");
const get_messages_v1 = require("./get_messages");
const message_agent_v1 = require("./message_agent");
const get_thread_messages_count_v1 = require("./get_thread_messages_count");
const edit_message_v1 = require("./edit_message");

module.exports = (api, socket) => {
  const { emitMessage, emitAgentMessage } = socket;
  api.post({ path: "/api/v1/message" }, create_message_v1, emitAgentMessage);
  api.post({ path: "/api/v1/message_agent" }, message_agent_v1, emitMessage);
  api.get({ path: "/api/v1/message" }, get_messages_v1);
  api.get({ path: "/api/v1/message/count" }, get_thread_messages_count_v1);
  api.patch({ path: "/api/v1/message/:_id" }, edit_message_v1);
};
