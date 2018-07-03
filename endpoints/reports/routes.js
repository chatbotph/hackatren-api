const api = module.parent.exports.api;

const

    //report
    add = require('./add_report')
//    edit = require('./edit_report'),
//     get_all = require('./get_report')


// api.get({ path: '/api/v1/report' }, get_all);

api.post({ path: '/api/v1/report' }, add);

// api.patch({ path: '/api/v1/report/:_id' }, edit);