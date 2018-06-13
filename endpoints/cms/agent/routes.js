const create_agent_v1 = require("./create_agent");
const agent_paginate_v1 = require("./agent_paginate");
const paginate_count_v1 = require("./paginate_count");
const get_agent_v1 = require("./get_agent");
const get_agents_v1 = require("./get_agents");
const delete_agent_v1 = require("./delete_agent");
const edit_agent_v1 = require("./edit_agent");

module.exports = api => {
  api.post({ path: "/api/v1/agent" }, create_agent_v1);
  api.get({ path: "/api/v1/agent/paginate" }, agent_paginate_v1);
  api.get({ path: "/api/v1/agent/paginate_count" }, paginate_count_v1);
  api.get({ path: "/api/v1/agent" }, get_agents_v1);
  api.get({ path: "/api/v1/agent/:_id" }, get_agent_v1);
  api.patch({ path: "/api/v1/agent/:_id" }, edit_agent_v1);
  api.del({ path: "/api/v1/agent/:_id" }, delete_agent_v1);
};
