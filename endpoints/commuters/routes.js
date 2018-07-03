const api = module.parent.exports.api;

const

    //commuter
    add = require('./add_commuter')
//    edit = require('./edit_commuter'),
     get_all = require('./get_commuter')


 api.get({ path: '/api/v1/commuter' }, get_all);

api.post({ path: '/api/v1/commuter' }, add);

// api.patch({ path: '/api/v1/commuter/:_id' }, edit);