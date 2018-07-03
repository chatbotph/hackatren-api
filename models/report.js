const
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    {
        requiredField,
        refGen,
        fieldTypes: {
            STR,
            DT,
            NUM
        }
    } = require('../utils/database');

const reports = new Schema({
    name: {
        first_name: requiredField(STR),
        last_name: requiredField(STR)
    },
    fb_id: requiredField(STR),
    station: requiredField(STR),
    report_date: requiredField(DT, true, Date.now),
    situation: requiredField(STR)
});

module.exports = mongoose.model('Reports', reports);