const create_thread_v1 = require("./create_thread");
const get_threads_v1 = require("./get_threads");
const update_thread_v1 = require("./update_thread");

module.exports = (api, socket) => {
  api.post({ path: "/api/v1/thread" }, create_thread_v1);
  api.get({ path: "/api/v1/thread" }, get_threads_v1);
  api.patch({ path: "/api/v1/thread/:_id" }, update_thread_v1);
};
